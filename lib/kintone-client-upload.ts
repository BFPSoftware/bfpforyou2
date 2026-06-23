export class FileTooLargeError extends Error {
    readonly maxBytes: number;
    readonly actualBytes: number;

    constructor(maxBytes: number, actualBytes: number) {
        super(`File too large. Max ${(maxBytes / (1024 * 1024)).toFixed(0)}MB.`);
        this.name = "FileTooLargeError";
        this.maxBytes = maxBytes;
        this.actualBytes = actualBytes;
    }
}

export class InvalidFileTypeError extends Error {
    readonly mimeType: string;

    constructor(mimeType: string) {
        super("Invalid file type. Please upload an image.");
        this.name = "InvalidFileTypeError";
        this.mimeType = mimeType;
    }
}

export class HeicConversionError extends Error {
    constructor() {
        super("Could not process HEIC/HEIF image. Please convert to JPG and try again.");
        this.name = "HeicConversionError";
    }
}

export class ImageProcessingError extends Error {
    constructor() {
        super("Could not process image.");
        this.name = "ImageProcessingError";
    }
}

export class KintoneUploadError extends Error {
    readonly status: number;
    readonly details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.name = "KintoneUploadError";
        this.status = status;
        this.details = details;
    }
}

export type UploadPhase = "converting" | "compressing" | "uploading";

export type UploadProgressCallback = (phase: UploadPhase) => void;

const MAX_INPUT_BYTES = 50 * 1024 * 1024; // 50MB
const COMPRESS_THRESHOLD_BYTES = 4 * 1024 * 1024; // 4MB
const COMPRESS_TARGET_MB = 3; // 3MB
const VERCEL_UPLOAD_CAP_BYTES = 4 * 1024 * 1024; // keep below 4.5MB hard cap
const MAX_WIDTH_OR_HEIGHT = 2560;
const FORCE_RESIZE_DIMENSION = 4096;
/** Always JPEG for storage compatibility; lossy compression keeps size down vs PNG. */
const OUTPUT_FILE_TYPE = "image/jpeg";

function isJpegMime(file: File): boolean {
    const t = (file.type || "").toLowerCase();
    return t === "image/jpeg" || t === "image/jpg";
}

/** Same stem as input, always `.jpg` and `image/jpeg` for downstream storage. */
function ensureJpegFile(blob: Blob, nameSource: File): File {
    const stem = (nameSource.name || "image").replace(/\.[^.]+$/, "");
    return new File([blob], `${stem}.jpg`, { type: OUTPUT_FILE_TYPE });
}

function looksLikeHeic(file: File): boolean {
    const name = (file.name || "").toLowerCase();
    const mime = (file.type || "").toLowerCase();
    return mime === "image/heic" || mime === "image/heif" || name.endsWith(".heic") || name.endsWith(".heif");
}

/** Browsers often leave `file.type` empty (common on mobile camera rolls). */
function resolveImageMime(file: File): string {
    const mime = (file.type || "").toLowerCase().trim();
    if (mime.startsWith("image/")) return mime;

    const name = (file.name || "").toLowerCase();
    if (/\.(jpe?g)$/.test(name)) return "image/jpeg";
    if (name.endsWith(".png")) return "image/png";
    if (name.endsWith(".gif")) return "image/gif";
    if (name.endsWith(".webp")) return "image/webp";
    if (name.endsWith(".bmp")) return "image/bmp";
    if (name.endsWith(".avif")) return "image/avif";
    if (/\.tiff?$/.test(name)) return "image/tiff";
    if (looksLikeHeic(file)) return "image/heic";

    return mime;
}

const UNSUPPORTED_IMAGE_MIMES = new Set(["image/svg+xml", "image/x-icon"]);

function assertSupportedImage(file: File): void {
    const mime = resolveImageMime(file);
    const name = (file.name || "").toLowerCase();

    if (name.endsWith(".svg") || UNSUPPORTED_IMAGE_MIMES.has(mime)) {
        throw new InvalidFileTypeError(mime || "image/svg+xml");
    }
    if (!mime.startsWith("image/")) {
        throw new InvalidFileTypeError(mime || "(unknown)");
    }
}

/** Re-attach inferred MIME so downstream checks and libraries see a consistent type. */
function withResolvedMime(file: File): File {
    const mime = resolveImageMime(file);
    if (!mime || mime === file.type) return file;
    return new File([file], file.name, { type: mime, lastModified: file.lastModified });
}

function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(null);
        };
        img.src = url;
    });
}

async function needsDimensionResize(file: File): Promise<boolean> {
    const dims = await getImageDimensions(file);
    if (!dims) return false;
    return dims.width > FORCE_RESIZE_DIMENSION || dims.height > FORCE_RESIZE_DIMENSION;
}

type CompressionOptions = {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    initialQuality: number;
};

async function compressImage(file: File, options: CompressionOptions): Promise<Blob> {
    const { default: imageCompression } = await import("browser-image-compression");
    const base = {
        maxSizeMB: options.maxSizeMB,
        maxWidthOrHeight: options.maxWidthOrHeight,
        fileType: OUTPUT_FILE_TYPE,
        initialQuality: options.initialQuality,
    };

    try {
        return await imageCompression(file, { ...base, useWebWorker: true });
    } catch {
        return await imageCompression(file, { ...base, useWebWorker: false });
    }
}

async function convertHeicIfNeeded(file: File, onProgress?: UploadProgressCallback): Promise<File> {
    if (!looksLikeHeic(file)) return file;

    onProgress?.("converting");
    try {
        const { default: heic2any } = await import("heic2any");
        const converted = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9,
        });

        const blob = Array.isArray(converted) ? converted[0] : converted;
        const outName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        return new File([blob as BlobPart], outName, { type: "image/jpeg" });
    } catch {
        throw new HeicConversionError();
    }
}

/** Small PNG/WebP/etc. skip heavy `compressIfNeeded`; still normalize to JPEG for storage. */
async function transcodeToJpegIfNeeded(file: File, onProgress?: UploadProgressCallback): Promise<File> {
    if (isJpegMime(file)) return file;

    onProgress?.("compressing");
    try {
        const out = await compressImage(file, {
            maxSizeMB: 100,
            maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
            initialQuality: 0.92,
        });
        return ensureJpegFile(out, file);
    } catch {
        throw new ImageProcessingError();
    }
}

async function compressIfNeeded(file: File, onProgress?: UploadProgressCallback): Promise<File> {
    const oversized = await needsDimensionResize(file);
    if (file.size < COMPRESS_THRESHOLD_BYTES && !oversized) return file;

    onProgress?.("compressing");
    try {
        const compressed1 = await compressImage(file, {
            maxSizeMB: COMPRESS_TARGET_MB,
            maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
            initialQuality: 0.8,
        });

        const out1 = ensureJpegFile(compressed1, file);

        if (out1.size > VERCEL_UPLOAD_CAP_BYTES) {
            const compressed2 = await compressImage(out1, {
                maxSizeMB: COMPRESS_TARGET_MB,
                maxWidthOrHeight: 1920,
                initialQuality: 0.65,
            });
            return ensureJpegFile(compressed2, file);
        }

        return out1;
    } catch {
        throw new ImageProcessingError();
    }
}

export async function uploadFileToKintone(
    file: File,
    onProgress?: UploadProgressCallback
): Promise<{ fileKey: string }> {
    if (!file) throw new Error("No file provided");

    if (file.size > MAX_INPUT_BYTES) {
        throw new FileTooLargeError(MAX_INPUT_BYTES, file.size);
    }

    assertSupportedImage(file);
    const normalizedInput = withResolvedMime(file);
    const convertedInput = await convertHeicIfNeeded(normalizedInput, onProgress);

    const mimeType = resolveImageMime(convertedInput);
    if (!mimeType.startsWith("image/")) {
        throw new InvalidFileTypeError(mimeType);
    }

    const jpegNormalized = await transcodeToJpegIfNeeded(convertedInput, onProgress);
    const toUpload = await compressIfNeeded(jpegNormalized, onProgress);

    if (toUpload.size > VERCEL_UPLOAD_CAP_BYTES) {
        throw new FileTooLargeError(VERCEL_UPLOAD_CAP_BYTES, toUpload.size);
    }

    onProgress?.("uploading");
    const { uploadFile } = await import("@/app/[lang]/actions/kintone/uploadFile");

    let res;
    try {
        res = await uploadFile({ file: toUpload });
    } catch (e) {
        throw new KintoneUploadError("Upload failed", 0, {
            networkError: e instanceof Error ? e.message : String(e),
        });
    }

    const fileKey = res?.data?.success;
    if (fileKey && typeof fileKey === "string") {
        return { fileKey };
    }

    throw new KintoneUploadError("Upload failed", 0, {
        serverError: res?.serverError,
        validationErrors: res?.validationErrors,
        failure: res?.data?.failure,
    });
}
