"use client";

interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg bg-error-bg text-error text-[0.85rem] italic transition-all duration-300 ${
        message
          ? "opacity-100 translate-y-0 max-h-24 px-3.5 py-3 mb-6"
          : "opacity-0 -translate-y-2.5 max-h-0 px-3.5 py-0 mb-0"
      }`}
    >
      {message}
    </div>
  );
}
