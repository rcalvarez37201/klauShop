import { gql } from "@/gql";
import { getServiceClient } from "@/lib/urql-service";
import { getURL } from "@/lib/utils";
import { MetadataRoute } from "next";

const AllProductsQuery = gql(/* GraphQL */ `
  query AllProductsSitemapQuery {
    productsCollection(
      filter: { stock: { gt: 0 } }
      orderBy: [{ created_at: DescNullsLast }]
      first: 10000
    ) {
      edges {
        node {
          id
          slug
          created_at
        }
      }
    }
  }
`);

const AllCollectionsQuery = gql(/* GraphQL */ `
  query AllCollectionsSitemapQuery {
    collectionsCollection(orderBy: [{ order: DescNullsLast }]) {
      edges {
        node {
          id
          slug
        }
      }
    }
  }
`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getURL();

  // URLs estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}special-orders`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    // Obtener todos los productos con stock
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productsResult = await getServiceClient().query(
      AllProductsQuery as any,
      {},
    );
    const products = productsResult.data?.productsCollection?.edges || [];

    const productRoutes: MetadataRoute.Sitemap = products.map(({ node }) => ({
      url: `${baseUrl}shop/${node.slug}`,
      lastModified: node.created_at ? new Date(node.created_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Obtener todas las colecciones
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collectionsResult = await getServiceClient().query(
      AllCollectionsQuery as any,
      {},
    );
    const collections =
      collectionsResult.data?.collectionsCollection?.edges || [];

    const collectionRoutes: MetadataRoute.Sitemap = collections.map(
      ({ node }) => ({
        url: `${baseUrl}collections/${node.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }),
    );

    return [...staticRoutes, ...productRoutes, ...collectionRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Si hay un error, devolver al menos las rutas estáticas
    return staticRoutes;
  }
}
