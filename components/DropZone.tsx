"use client";

import { useCallback, useRef, useState } from "react";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function DropZone({
  onFiles,
  multiple = false,
  children,
  className = "",
}: DropZoneProps) {
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragover(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === "application/pdf"
      );
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) onFiles(files);
      e.target.value = "";
    },
    [onFiles]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragover(true);
      }}
      onDragLeave={() => setDragover(false)}
      onDrop={handleDrop}
      className={`cursor-pointer rounded-lg border border-border-default bg-bg-surface px-5 py-7 text-center transition-all duration-200 hover:border-accent-warm hover:-translate-y-px active:translate-y-0 ${
        dragover ? "border-accent-warm bg-accent-bg scale-[1.01]" : ""
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      {children}
    </div>
  );
}
