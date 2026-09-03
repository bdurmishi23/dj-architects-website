import { createImageUrlBuilder } from "@sanity/image-url";
import { projectId, dataset } from "./client";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImage | undefined) {
  if (!source?.asset?._ref) return undefined;
  return builder.image(source);
}
