"use client";

import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { apiService } from "@/services/api";

interface UploadButtonProps {
  label?: string;
  allowedExt?: string; // e.g. "jpg,png,svg,pdf"
  onUploaded: (result: { filename: string; url: string; raw?: any }) => void;
  className?: string;
}

export function UploadButton({
  label = "Upload",
  allowedExt,
  onUploaded,
  className,
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const resp: any = await apiService.uploadFile(file, allowedExt);
      // Try to infer filename from response.data; backend schema not explicit, so be flexible
      const data: any = resp?.data;
      const filename = data?.filename || data?.name || data?.file || "";
      // Always use our same-origin proxy URL for reliability
      const url = apiService.getFileUrl(filename);
      onUploaded({ filename, url, raw: data });
    } catch (err: any) {
      const msg = (() => {
        if (typeof err === "string") return err;
        if (err?.message) return err.message;
        try {
          const body = err?.responseBody || err?.body;
          if (body && typeof body === "string") {
            const j = JSON.parse(body);
            return j?.message || "Upload gagal";
          }
        } catch {}
        return "Upload gagal";
      })();
      setError(msg);
    } finally {
      setLoading(false);
      // reset input value to allow re-select same file
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={
          allowedExt
            ? allowedExt
                .split(",")
                .map((ext) => `.${ext.trim()}`)
                .join(",")
            : undefined
        }
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 inline-flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {loading ? "Uploading..." : label}
      </button>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
}
