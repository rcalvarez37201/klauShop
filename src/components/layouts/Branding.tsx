import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = { className?: string; width?: number; height?: number };

function Branding({ className, width = 100, height = 100 }: Props) {
  return (
    <Link
      href="/"
      className={cn("text-2xl font-medium align-middle", className)}
    >
      <Image
        src="/imagotipo_horizontal.svg"
        alt={siteConfig.name}
        width={width}
        height={height}
      />
    </Link>
  );
}

export default Branding;
