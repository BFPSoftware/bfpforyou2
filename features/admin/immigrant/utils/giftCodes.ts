/**
 * Parse gift codes from the coordinator Kintone `giftCodes` field.
 *
 * Supports:
 * - MULTI_SELECT / CHECK_BOX → string[]
 * - MULTI_LINE_TEXT / SINGLE_LINE_TEXT with codes separated by commas,
 *   semicolons, or newlines (e.g. "1001, 1002, 1003")
 *
 * Does not treat numeric ranges — each token is an exact gift code string.
 */
export function parseGiftCodes(value: unknown): string[] {
    if (Array.isArray(value)) {
        return unique(value.map(String).flatMap(splitCodes));
    }
    if (typeof value === "string") {
        return unique(splitCodes(value));
    }
    return [];
}

function splitCodes(raw: string): string[] {
    return raw
        .split(/[,;\n\r]+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

function unique(codes: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const code of codes) {
        if (seen.has(code)) continue;
        seen.add(code);
        out.push(code);
    }
    return out;
}
