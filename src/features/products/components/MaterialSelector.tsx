"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MaterialSelectorProps {
  materials?: string[] | null;
  selectedMaterial?: string;
  onMaterialSelect: (material: string) => void;
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

export function MaterialSelector({
  materials,
  selectedMaterial,
  onMaterialSelect,
  className,
}: MaterialSelectorProps) {
  const normalizedMaterials = normalizeToArray(materials);

  if (normalizedMaterials.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">Material</label>
      <Select value={selectedMaterial} onValueChange={onMaterialSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a material" />
        </SelectTrigger>
        <SelectContent>
          {normalizedMaterials.map((material) => (
            <SelectItem key={material} value={material}>
              {material}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
