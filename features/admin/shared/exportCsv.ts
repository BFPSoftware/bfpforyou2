export function downloadCsv(filename: string, headers: string[], rows: string[][]) {
    const escape = (cell: string) => {
        const value = cell ?? "";
        if (/[",\n]/.test(value)) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    };

    const lines = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))];
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
