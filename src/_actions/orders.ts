"use server";

import db from "@/lib/supabase/db";
import {
  inventoryReservations,
  orderLines,
  orders,
} from "@/lib/supabase/schema";
import { eq } from "drizzle-orm";

export const deleteOrderAction = async (orderId: string) => {
  // Verificar que la orden existe
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) {
    throw new Error("La orden no existe.");
  }

  // Eliminar primero las orderLines (tienen onDelete: "restrict")
  await db.delete(orderLines).where(eq(orderLines.orderId, orderId));

  // Las inventoryReservations se eliminarán automáticamente por CASCADE
  // pero las eliminamos explícitamente para ser claros
  await db
    .delete(inventoryReservations)
    .where(eq(inventoryReservations.orderId, orderId));

  // Finalmente eliminar la orden
  const deletedOrder = await db
    .delete(orders)
    .where(eq(orders.id, orderId))
    .returning();

  if (deletedOrder.length === 0) {
    throw new Error("No se pudo eliminar la orden.");
  }

  return deletedOrder;
};
