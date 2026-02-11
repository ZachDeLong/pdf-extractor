"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DropZone } from "./DropZone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getPdfPageCount, extractPages, downloadPdf } from "@/lib/pdf";
import { parsePageRange } from "@/lib/parse-page-range";

interface ExtractTabProps {
  onError: (msg: string | null) => void;
}

export function ExtractTab({ onError }: ExtractTabProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState("");
  const [offset, setOffset] = useState("");
  const [processing, setProcessing] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem("offset");
    if (saved) setOffset(saved);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleFiles = useCallback(
    async (files: File[]) => {
      onError(null);
      const f = files[0];
      setFile(f);
      setPageCount(null);
      setLoading(true);

      try {
        const count = await getPdfPageCount(f);
        if (mountedRef.current) {
          setPageCount(count);
        }
      } catch {
        if (mountedRef.current) {
          onError("Could not read PDF");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [onError]
  );

  const handleOffsetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOffset(e.target.value);
      localStorage.setItem("offset", e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      onError(null);
      if (!file || !pages) return;

      setProcessing(true);
      try {
        const parsed = parsePageRange(pages);
        const offsetNum = parseInt(offset) || 0;
        const result = await extractPages(file, parsed, offsetNum);
        downloadPdf(result.bytes, result.filename);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setProcessing(false);
      }
    },
    [file, pages, offset, onError]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-[fade-slide-in_0.3s_cubic-bezier(0,0,0.2,1)]"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-text-muted font-medium">file</label>
          <span
            className={`text-sm text-accent-warm transition-opacity duration-300 ${loading ? "opacity-50" : ""}`}
          >
            {loading
              ? "checking..."
              : pageCount !== null
                ? `${pageCount} pages`
                : ""}
          </span>
        </div>
        <DropZone
          onFiles={handleFiles}
          className={file ? "border-accent-warm bg-accent-bg" : ""}
        >
          {file ? (
            <span className="text-sm text-accent-warm animate-[fade-in_0.3s_ease]">
              {file.name}
            </span>
          ) : (
            <span className="text-sm text-text-muted">drop pdf</span>
          )}
        </DropZone>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-text-muted font-medium mb-2">
          pages
        </label>
        <Input
          type="text"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          placeholder="1-26"
          required
        />
        <p className="text-xs text-text-muted mt-2">
          ranges like 1-26 or individual like 5, 12
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-text-muted font-medium mb-2">
          skip intro pages
        </label>
        <Input
          type="number"
          value={offset}
          onChange={handleOffsetChange}
          placeholder="0"
          min="0"
        />
        <p className="text-xs text-text-muted mt-2">
          skip title pages, table of contents, etc.
        </p>
      </div>

      <Button type="submit" disabled={!file || !pages || processing} className="w-full">
        {processing ? "preparing..." : "download"}
      </Button>
    </form>
  );
}
