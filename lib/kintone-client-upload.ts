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

/** File handle could not be read (common on iOS after backgrounding / empty pick). */
export class EmptyFileError extends Error {
    constructor() {
        super("Could not read this photo. Please try again or pick another image.");
        this.name = "EmptyFileError";
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

export class UploadTimeoutError extends Error {
    constructor() {
        super("Upload timed out. Please try again.");
        this.name = "UploadTimeoutError";
    }
}

export type UploadPhase = "converting" | "compressing" | "uploading";

export type UploadProgressCallback = (phase: UploadPhase) => void;

const MAX_INPUT_BYTES = 50 * 1024 * 1024; // 50MB
const COMPRESS_TARGET_MB = 3; // 3MB
const VERCEL_UPLOAD_CAP_BYTES = 4 * 1024 * 1024; // keep below 4.5MB hard cap
const MAX_WIDTH_OR_HEIGHT = 2560;
const UPLOAD_TIMEOUT_MS = 120_000;
const HEIC_TIMEOUT_MS = 60_000;
const COMPRESS_TIMEOUT_MS = 60_000;
const NETWORK_RETRY_DELAY_MS = 500;
/** Always JPEG for storage compatibility; lossy compression keeps size down vs PNG. */
const OUTPUT_FILE_TYPE = "image/jpeg";

type SniffedImageMime =
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp"
    | "image/heic"
    | "image/avif"
    | null;

function isKnownUploadError(e: unknown): boolean {
    return (
        e instanceof FileTooLargeError ||
        e instanceof InvalidFileTypeError ||
        e instanceof HeicConversionError ||
        e instanceof ImageProcessingError ||
        e instanceof EmptyFileError ||
        e instanceof KintoneUploadError ||
        e instanceof UploadTimeoutError
    );
}

/** Same stem as input, always `.jpg` and `image/jpeg` for downstream storage. */
function ensureJpegFile(blob: Blob, nameSource: { name?: string }): File {
    const stem = (nameSource.name || "image").replace(/\.[^.]+$/, "");
    return new File([blob], `${stem}.jpg`, { type: OUTPUT_FILE_TYPE });
}

function bytesToAscii(bytes: Uint8Array, start: number, length: number): string {
    let s = "";
    const end = Math.min(start + length, bytes.length);
    for (let i = start; i < end; i++) {
        s += String.fromCharCode(bytes[i]!);
    }
    return s;
}

/** Detect real format from magic bytes — MIME/extension often lie on mobile. */
function sniffImageMime(buffer: ArrayBuffer): SniffedImageMime {
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 12) return null;

    // JPEG
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
    // PNG
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
    // GIF
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
    // WEBP: RIFF....WEBP
    if (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
    ) {
        return "image/webp";
    }
    // ISO BMFF (HEIC/HEIF/AVIF): ....ftyp????
    if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
        const brand = bytesToAscii(bytes, 8, 4).toLowerCase();
        if (brand === "avif" || brand === "avis") return "image/avif";
        if (
            brand === "heic" ||
            brand === "heix" ||
            brand === "hevc" ||
            brand === "hevx" ||
            brand === "heim" ||
            brand === "heis" ||
            brand === "hevm" ||
            brand === "hevs" ||
            brand === "mif1" ||
            brand === "msf1" ||
            brand === "heif"
        ) {
            return "image/heic";
        }
        // Scan compatible brands in the ftyp box for heic/avif
        const boxSize = (bytes[0]! << 24) | (bytes[1]! << 16) | (bytes[2]! << 8) | bytes[3]!;
        const scanEnd = Math.min(bytes.length, Number.isFinite(boxSize) && boxSize > 0 ? boxSize : 64);
        const ftypPayload = bytesToAscii(bytes, 8, scanEnd - 8).toLowerCase();
        if (ftypPayload.includes("avif") || ftypPayload.includes("avis")) return "image/avif";
        if (
            ftypPayload.includes("heic") ||
            ftypPayload.includes("heif") ||
            ftypPayload.includes("mif1") ||
            ftypPayload.includes("msf1")
        ) {
            return "image/heic";
        }
    }

    return null;
}

function extensionMime(name: string): string {
    const lower = (name || "").toLowerCase();
    if (/\.(jpe?g)$/.test(lower)) return "image/jpeg";
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".gif")) return "image/gif";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".bmp")) return "image/bmp";
    if (lower.endsWith(".avif")) return "image/avif";
    if (/\.tiff?$/.test(lower)) return "image/tiff";
    if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
    return "";
}

/**
 * Prefer magic-byte sniff over declared MIME/extension.
 * Handles empty type, application/octet-stream, and .jpg that is actually HEIC.
 */
function resolveImageMime(file: File, sniffed: SniffedImageMime): string {
    if (sniffed) return sniffed;

    const declared = (file.type || "").toLowerCase().trim();
    if (declared.startsWith("image/") && declared !== "image/svg+xml") return declared;

    const fromName = extensionMime(file.name);
    if (fromName) return fromName;

    return declared || "(unknown)";
}

function isHeicMime(mime: string): boolean {
    const m = mime.toLowerCase();
    return m === "image/heic" || m === "image/heif";
}

const UNSUPPORTED_IMAGE_MIMES = new Set(["image/svg+xml", "image/x-icon"]);

function assertSupportedImage(mime: string, fileName: string): void {
    const name = (fileName || "").toLowerCase();
    if (name.endsWith(".svg") || UNSUPPORTED_IMAGE_MIMES.has(mime) || mime.includes("svg")) {
        throw new InvalidFileTypeError(mime || "image/svg+xml");
    }
    if (!mime.startsWith("image/")) {
        throw new InvalidFileTypeError(mime || "(unknown)");
    }
}

/**
 * Read file bytes into memory immediately so iOS cannot revoke the photo-library handle
 * after backgrounding (lazy File → 0-byte upload).
 */
async function materializeFile(file: File): Promise<{ file: File; buffer: ArrayBuffer }> {
    let buffer: ArrayBuffer;
    try {
        buffer = await file.arrayBuffer();
    } catch {
        throw new EmptyFileError();
    }

    if (!buffer || buffer.byteLength === 0) {
        throw new EmptyFileError();
    }

    const sniffed = sniffImageMime(buffer);
    const mime = resolveImageMime(file, sniffed);
    const name = file.name || (isHeicMime(mime) ? "photo.heic" : "photo.jpg");
    const memoryFile = new File([buffer], name, {
        type: mime.startsWith("image/") ? mime : file.type || "application/octet-stream",
        lastModified: file.lastModified || Date.now(),
    });

    return { file: memoryFile, buffer };
}

function withTimeout<T>(promise: Promise<T>, ms: number, onTimeout: () => Error): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(onTimeout()), ms);
        promise
            .then((value) => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch((err) => {
                clearTimeout(timer);
                reject(err);
            });
    });
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run async work while converting same-tick unhandled rejections into a catchable error.
 * Helps when image libs (HEIC / compression workers) reject outside the awaited promise.
 */
async function runIsolated<T>(work: () => Promise<T>, fallback: () => Error): Promise<T> {
    let rejectGuard: ((reason: unknown) => void) | null = null;
    const guard = new Promise<never>((_, reject) => {
        rejectGuard = reject;
    });

    const onUnhandled = (event: PromiseRejectionEvent) => {
        event.preventDefault();
        rejectGuard?.(event.reason ?? fallback());
    };

    if (typeof window !== "undefined") {
        window.addEventListener("unhandledrejection", onUnhandled);
    }

    try {
        return await Promise.race([
            Promise.resolve()
                .then(work)
                .catch((err) => {
                    throw err;
                }),
            guard,
        ]);
    } catch (e) {
        if (isKnownUploadError(e)) throw e;
        throw fallback();
    } finally {
        if (typeof window !== "undefined") {
            window.removeEventListener("unhandledrejection", onUnhandled);
        }
    }
}

type CompressionOptions = {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    initialQuality: number;
};

async function compressImage(file: File, options: CompressionOptions): Promise<Blob> {
    return runIsolated(async () => {
        const { default: imageCompression } = await import("browser-image-compression");
        const base = {
            maxSizeMB: options.maxSizeMB,
            maxWidthOrHeight: options.maxWidthOrHeight,
            fileType: OUTPUT_FILE_TYPE,
            initialQuality: options.initialQuality,
            // Do not preserve EXIF — canvas decode applies orientation into upright pixels.
            preserveExif: false,
        };

        // Prefer main-thread first — web workers are a common source of uncaught mobile failures.
        try {
            return await withTimeout(
                imageCompression(file, { ...base, useWebWorker: false }),
                COMPRESS_TIMEOUT_MS,
                () => new ImageProcessingError()
            );
        } catch {
            return await withTimeout(
                imageCompression(file, { ...base, useWebWorker: true }),
                COMPRESS_TIMEOUT_MS,
                () => new ImageProcessingError()
            );
        }
    }, () => new ImageProcessingError());
}

async function convertHeicIfNeeded(file: File, mime: string, onProgress?: UploadProgressCallback): Promise<File> {
    if (!isHeicMime(mime)) return file;

    onProgress?.("converting");
    return runIsolated(async () => {
        const { default: heic2any } = await import("heic2any");
        const converted = await withTimeout(
            Promise.resolve(
                heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.9,
                })
            ),
            HEIC_TIMEOUT_MS,
            () => new HeicConversionError()
        );

        const blob = Array.isArray(converted) ? converted[0] : converted;
        if (!blob) throw new HeicConversionError();

        const outName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        return new File([blob as BlobPart], outName, { type: "image/jpeg" });
    }, () => new HeicConversionError());
}

/**
 * Always run through canvas JPEG encode so EXIF-oriented photos become upright pixels
 * and non-JPEG inputs are normalized for Kintone storage.
 */
async function normalizeToJpeg(file: File, onProgress?: UploadProgressCallback): Promise<File> {
    onProgress?.("compressing");
    try {
        const out = await compressImage(file, {
            maxSizeMB: COMPRESS_TARGET_MB,
            maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
            initialQuality: 0.8,
        });
        let result = ensureJpegFile(out, file);

        if (result.size > VERCEL_UPLOAD_CAP_BYTES) {
            const compressed2 = await compressImage(result, {
                maxSizeMB: COMPRESS_TARGET_MB,
                maxWidthOrHeight: 1920,
                initialQuality: 0.65,
            });
            result = ensureJpegFile(compressed2, file);
        }

        return result;
    } catch (e) {
        if (isKnownUploadError(e)) throw e;
        throw new ImageProcessingError();
    }
}

function withUploadTimeout<T>(promise: Promise<T>, ms = UPLOAD_TIMEOUT_MS): Promise<T> {
    return withTimeout(promise, ms, () => new UploadTimeoutError());
}

function shouldRetryUpload(status: number): boolean {
    return status === 502 || status === 503 || status === 504;
}

async function postFileToUploadApiOnce(file: Blob): Promise<{ fileKey?: string; status: number; failure?: string }> {
    if (!(file.size > 0)) {
        throw new EmptyFileError();
    }

    const formData = new FormData();
    // Explicit filename helps Safari FormData with constructed Blob/File.
    formData.append("file", file, "upload.jpg");

    let res: Response;
    try {
        res = await fetch("/api/kintone/uploadFile", {
            method: "POST",
            body: formData,
        });
    } catch (e) {
        throw new KintoneUploadError("Upload failed", 0, {
            networkError: e instanceof Error ? e.message : String(e),
            retryable: true,
        });
    }

    let data: { success?: string; failure?: string } = {};
    try {
        data = (await res.json()) as { success?: string; failure?: string };
    } catch {
        throw new KintoneUploadError("Upload failed", res.status, {
            bodyParseError: true,
            retryable: shouldRetryUpload(res.status),
        });
    }

    if (res.ok && typeof data.success === "string" && data.success) {
        return { fileKey: data.success, status: res.status };
    }

    throw new KintoneUploadError("Upload failed", res.status, {
        failure: data.failure,
        retryable: shouldRetryUpload(res.status),
    });
}

async function postFileToUploadApi(file: Blob): Promise<string> {
    try {
        const first = await postFileToUploadApiOnce(file);
        return first.fileKey!;
    } catch (e) {
        const retryable =
            e instanceof KintoneUploadError &&
            (e.status === 0 || shouldRetryUpload(e.status) || (e.details as { retryable?: boolean } | undefined)?.retryable);

        if (!retryable) throw e;

        await delay(NETWORK_RETRY_DELAY_MS);
        const second = await postFileToUploadApiOnce(file);
        return second.fileKey!;
    }
}

export async function uploadFileToKintone(
    file: File,
    onProgress?: UploadProgressCallback
): Promise<{ fileKey: string }> {
    return withUploadTimeout(
        (async () => {
            try {
                return await uploadFileToKintoneInner(file, onProgress);
            } catch (e) {
                if (isKnownUploadError(e)) throw e;
                throw new ImageProcessingError();
            }
        })()
    );
}

async function uploadFileToKintoneInner(
    file: File,
    onProgress?: UploadProgressCallback
): Promise<{ fileKey: string }> {
    if (!file) throw new EmptyFileError();

    if (file.size === 0) {
        throw new EmptyFileError();
    }

    if (file.size > MAX_INPUT_BYTES) {
        throw new FileTooLargeError(MAX_INPUT_BYTES, file.size);
    }

    // Materialize first — before any async gap where iOS can revoke the file handle.
    const { file: memoryFile, buffer } = await materializeFile(file);
    const sniffed = sniffImageMime(buffer);
    const mime = resolveImageMime(memoryFile, sniffed);

    assertSupportedImage(mime, memoryFile.name);

    const typedFile =
        memoryFile.type === mime
            ? memoryFile
            : new File([buffer], memoryFile.name, {
                  type: mime,
                  lastModified: memoryFile.lastModified,
              });

    const convertedInput = await convertHeicIfNeeded(typedFile, mime, onProgress);
    const toUpload = await normalizeToJpeg(convertedInput, onProgress);

    if (toUpload.size === 0) {
        throw new EmptyFileError();
    }

    if (toUpload.size > VERCEL_UPLOAD_CAP_BYTES) {
        throw new FileTooLargeError(VERCEL_UPLOAD_CAP_BYTES, toUpload.size);
    }

    onProgress?.("uploading");
    const fileKey = await postFileToUploadApi(toUpload);
    return { fileKey };
}
