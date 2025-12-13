"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPickerProps {
  colors?: string[] | null;
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  className?: string;
}

// Helper function to normalize JSON values to array
function normalizeToArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function ColorPicker({
  colors,
  selectedColor,
  onColorSelect,
  className,
}: ColorPickerProps) {
  const normalizedColors = normalizeToArray(colors);

  if (normalizedColors.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">Color</label>
      <div className="flex flex-wrap gap-2">
        {normalizedColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorSelect(color)}
            className={cn(
              "relative h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
              selectedColor === color
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-gray-300 hover:border-gray-400",
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {selectedColor === color && (
              <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
