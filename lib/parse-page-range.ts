/**
 * Parse a page range string like "1-26, 30, 45-50" into a list of page numbers.
 */
export function parsePageRange(input: string): number[] {
  const pages: number[] = [];
  const parts = input.replace(/\s/g, "").split(",");

  for (const part of parts) {
    if (!part) continue;

    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = Number(startStr);
      const end = Number(endStr);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid range format: ${part}`);
      }
      if (start > end) {
        throw new Error(`Invalid range: ${part}`);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    } else {
      const num = Number(part);
      if (isNaN(num)) {
        throw new Error(`Invalid page number: ${part}`);
      }
      pages.push(num);
    }
  }

  return pages;
}
