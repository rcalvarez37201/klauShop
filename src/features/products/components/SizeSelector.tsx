"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes?: string[] | null;
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
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

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
  className,
}: SizeSelectorProps) {
  const normalizedSizes = normalizeToArray(sizes);

  if (normalizedSizes.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">Size</label>
      <div className="flex flex-wrap gap-2">
        {normalizedSizes.map((size) => (
          <Button
            key={size}
            type="button"
            variant={selectedSize === size ? "default" : "outline"}
            onClick={() => onSizeSelect(size)}
            className={cn(
              "min-w-[3rem]",
              selectedSize === size && "bg-primary text-primary-foreground",
            )}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}
