import { gql } from "@/gql";
import { getServiceClient } from "@/lib/urql-service";
import CategoriesSubNavClient from "./CategoriesSubNavClient";

const CategoriesSubNavQuery = gql(/* GraphQL */ `
  query CategoriesSubNavQuery {
    collectionsCollection(orderBy: [{ order: DescNullsLast }]) {
      edges {
        node {
          id
          label
          slug
          title
          parent_id
          order
        }
      }
    }
  }
`);

export default async function CategoriesSubNav() {
  const { data } = await getServiceClient().query(CategoriesSubNavQuery, {});

  if (!data?.collectionsCollection?.edges) {
    return null;
  }

  const collections = data.collectionsCollection.edges.map((edge) => ({
    id: edge.node.id,
    label: edge.node.label,
    slug: edge.node.slug,
    title: edge.node.title,
    parent_id: edge.node.parent_id,
    order: edge.node.order,
  }));

  return <CategoriesSubNavClient categories={collections} />;
}
