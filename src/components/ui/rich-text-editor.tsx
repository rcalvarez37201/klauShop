"use client";

import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe la descripción del producto...",
  className,
  error,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
    }),
    [],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
  ];

  return (
    <div className={cn("rich-text-editor-wrapper", className)}>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={cn(
          error && "border-red-500",
          "[&_.ql-editor]:min-h-[200px]",
          "[&_.ql-container]:border-[1px] [&_.ql-container]:border-input [&_.ql-container]:rounded-md",
          "[&_.ql-toolbar]:border-[1px] [&_.ql-toolbar]:border-b-0 [&_.ql-toolbar]:border-input [&_.ql-toolbar]:rounded-t-md",
          "[&_.ql-container]:rounded-b-md",
        )}
      />
    </div>
  );
}
