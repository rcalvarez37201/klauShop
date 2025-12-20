"use client";

import { Icons } from "@/components/layouts/icons";
import { Button } from "@/components/ui/button";
import { cn, getURL, stripHtml } from "@/lib/utils";

type ShareProductButtonProps = {
  name: string;
  price: number;
  discount?: number | null;
  description?: string | null;
  slug: string;
  imageKey?: string | null;
  className?: string;
};

export function ShareProductButton({
  name,
  price,
  discount,
  description,
  slug,
  imageKey,
}: ShareProductButtonProps) {
  const handleShare = () => {
    // Calcular precio con descuento
    const discountValue = discount ? parseFloat(discount.toString()) : 0;
    const hasDiscount = discountValue > 0;
    const priceValue = parseFloat(price.toString());
    const discountedPrice = hasDiscount
      ? priceValue - (priceValue * discountValue) / 100
      : priceValue;

    // Obtener URL base del sitio
    const baseUrl = getURL();
    const productUrl = `${baseUrl}shop/${slug}`;

    // Limpiar descripción de HTML y obtener primeras líneas
    const cleanDescription = stripHtml(description || "");
    const descriptionPreview = cleanDescription
      .split("\n")
      .slice(0, 2)
      .join(" ")
      .substring(0, 120);
    const descriptionText = descriptionPreview
      ? `\n\n${descriptionPreview}${cleanDescription.length > 120 ? "..." : ""}`
      : "";

    // Construir mensaje con gancho para nuevos clientes
    // La imagen aparecerá automáticamente gracias a los Open Graph tags
    const discountText = hasDiscount
      ? `💰 *Precio especial:* ${discountedPrice.toFixed(2)} CUP (antes ${priceValue.toFixed(2)} CUP)`
      : `💰 *Precio:* ${priceValue.toFixed(2)} CUP`;

    const message = `🛍️ *${name}*

${discountText}${descriptionText}

✨ *¡Descubre más productos increíbles en nuestra tienda!*
🛒 ${productUrl}

💬 *¿Tienes preguntas?* Contáctanos y te ayudamos con gusto.
🎁 *¡Nuevos clientes reciben atención especial!*`;

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="icon"
      className={cn(
        "hover:bg-green-50 hover:border-green-500 hover:text-green-600",
        className,
      )}
      aria-label="Compartir producto por WhatsApp"
    >
      <Icons.whatsapp className="h-5 w-5" />
    </Button>
  );
}
