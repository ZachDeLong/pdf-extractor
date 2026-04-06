"use client";

import { useCallback, useRef, useState } from "react";
import { DropZone } from "./DropZone";
import { MergeItem } from "./MergeItem";
import { Button } from "./ui/button";
import { mergePdfs, downloadPdf } from "@/lib/pdf";

interface MergeTabProps {
  onError: (msg: string | null) => void;
}

export function MergeTab({ onError }: MergeTabProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const dragIndexRef = useRef<number | null>(null);
  const lastTargetRef = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const addFiles = useCallback(
    (newFiles: File[]) => {
      onError(null);
      setFiles((prev) => [...prev, ...newFiles]);
    },
    [onError]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragStart = useCallback((index: number) => {
    dragIndexRef.current = index;
    setDraggingIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      const fromIndex = dragIndexRef.current;
      if (fromIndex === null || fromIndex === targetIndex) return;
      if (lastTargetRef.current === targetIndex) return;
      lastTargetRef.current = targetIndex;

      setFiles((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(targetIndex, 0, moved);
        return next;
      });
      dragIndexRef.current = targetIndex;
      setDraggingIndex(targetIndex);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
    lastTargetRef.current = null;
    setDraggingIndex(null);
  }, []);

  const handleMerge = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (files.length < 2) return;

      onError(null);
      setProcessing(true);
      try {
        const bytes = await mergePdfs(files);
        downloadPdf(bytes, "merged.pdf");
      } catch (err) {
        onError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setProcessing(false);
      }
    },
    [files, onError]
  );

  return (
    <form
      onSubmit={handleMerge}
      className="animate-[fade-slide-in_0.3s_cubic-bezier(0,0,0.2,1)]"
    >
      <div className="min-h-[60px] rounded-lg border border-border-default bg-bg-surface p-3 mb-4 transition-all duration-200 hover:border-accent-warm">
        {files.length === 0 ? (
          <DropZone
            onFiles={addFiles}
            multiple
            className="border-none bg-transparent p-0 hover:translate-y-0"
          >
            <span className="text-sm text-text-muted py-5 block">
              drop pdfs here or click below
            </span>
          </DropZone>
        ) : (
          <div className="flex flex-col gap-2">
            {files.map((file, i) => (
              <MergeItem
                key={`${file.name}-${file.size}-${i}`}
                name={file.name}
                index={i}
                onRemove={() => removeFile(i)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                dragging={draggingIndex === i}
              />
            ))}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".pdf";
          input.multiple = true;
          input.onchange = () => {
            if (input.files) addFiles(Array.from(input.files));
          };
          input.click();
        }}
        className="w-full mb-6"
      >
        + add pdfs
      </Button>

      <Button
        type="submit"
        disabled={files.length < 2 || processing}
        className="w-full"
      >
        {processing ? "merging..." : "merge pdfs"}
      </Button>
    </form>
  );
}
