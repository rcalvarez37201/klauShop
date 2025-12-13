"use client";

import { gql } from "@/gql";
import Image from "next/image";
import React from "react";
import { Card } from "../../../components/ui/card";

import { cn, keytoUrl } from "@/lib/utils";
import { useQuery } from "@urql/next";
import { Icons } from "../../../components/layouts/icons";
import { Skeleton } from "../../../components/ui/skeleton";

interface ImagePreviewCard extends React.ComponentProps<typeof Card> {
  mediaId: string;
}

export const FetchMediaQuery = gql(/* GraphQL */ `
  query FetchMediaQuery($mediaId: String) {
    mediasCollection(filter: { id: { eq: $mediaId } }) {
      edges {
        node {
          id
          alt
          key
        }
      }
    }
  }
`);

function ImagePreviewCard({ mediaId }: ImagePreviewCard) {
  const [{ data, fetching, error }] = useQuery({
    query: FetchMediaQuery,
    variables: {
      mediaId: mediaId,
    },
    pause: !mediaId,
    requestPolicy: "cache-first",
  });

  if (!mediaId) {
    return (
      <div className="h-32 w-32 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center text-sm text-muted-foreground">
        No image
      </div>
    );
  }

  if (fetching)
    return (
      <Card className="group relative">
        <Skeleton className="w-[120px] h-[120px]" />
      </Card>
    );

  if (error) {
    return (
      <Card className="group relative">
        <div className="w-[120px] h-[120px] flex items-center justify-center text-xs text-destructive">
          Error loading image
        </div>
      </Card>
    );
  }

  if (data && data.mediasCollection.edges[0]?.node) {
    const media = data.mediasCollection.edges[0].node;
    return (
      <Card className="group relative">
        <div className="relative">
          <Image
            className="group-hover:opacity-80 transition-all duration-200 rounded-md"
            src={keytoUrl(media.key)}
            alt={media.alt}
            width={120}
            height={120}
          />
          <Icons.edit
            className={cn(
              "absolute w-5 h-5 right-2 top-2 hidden group-hover:block",
            )}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="group relative">
      <div className="w-[120px] h-[120px] flex items-center justify-center text-xs text-muted-foreground">
        Image not found
      </div>
    </Card>
  );
}

export default ImagePreviewCard;
