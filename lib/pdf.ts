import { PDFDocument } from "pdf-lib";

export async function getPdfPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

export async function extractPages(
  file: File,
  pages: number[],
  offset: number
): Promise<{ bytes: Uint8Array; filename: string }> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const totalPages = src.getPageCount();

  const adjusted = pages.map((p) => p + offset);

  const invalid = adjusted.filter((p) => p < 1 || p > totalPages);
  if (invalid.length > 0) {
    throw new Error(
      `Invalid pages: ${invalid.join(", ")}. PDF has ${totalPages} pages.`
    );
  }

  const dest = await PDFDocument.create();
  // pdf-lib uses 0-based indices
  const copied = await dest.copyPages(
    src,
    adjusted.map((p) => p - 1)
  );
  for (const page of copied) {
    dest.addPage(page);
  }

  const pdfBytes = await dest.save();
  const baseName = file.name.replace(/\.pdf$/i, "");
  const rangeStr = collapseRanges(pages);
  const filename = `${baseName}_pages_${rangeStr}.pdf`;

  return { bytes: pdfBytes, filename };
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const dest = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const copied = await dest.copyPages(src, src.getPageIndices());
    for (const page of copied) {
      dest.addPage(page);
    }
  }

  return dest.save();
}

function collapseRanges(pages: number[]): string {
  if (pages.length === 0) return "";
  const ranges: string[] = [];
  let start = pages[0];
  let end = pages[0];
  for (let i = 1; i < pages.length; i++) {
    if (pages[i] === end + 1) {
      end = pages[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = pages[i];
      end = pages[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join("_");
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
