import { z } from "zod";

export const AddProductToCartSchema = z.object({
  quantity: z.number().min(0).max(8),
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
});

export type AddProductCartData = z.infer<typeof AddProductToCartSchema>;
