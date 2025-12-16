import { z } from "zod";

export enum SortEnum {
  BEST_MATCH = "Mejor coincidencia",
  PRICE_LOW_TO_HIGH = "Precio: de menor a mayor",
  PRICE_HIGH_TO_LOW = "Precio: de mayor a menor",
  NEWEST = "Más reciente",
  NAME_ASCE = "Nombre: de A a Z",
}

export const SearchProductActionSchema = z.object({
  query: z.string(),
  sort: z.nativeEnum(SortEnum).nullable().optional(),
});
