import { getURL } from "@/lib/utils";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getURL();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/setting/",
          "/cart",
          "/orders/",
          "/wish-list",
          "/_next/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/setting/",
          "/cart",
          "/orders/",
          "/wish-list",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}sitemap.xml`,
  };
}
