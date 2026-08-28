import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-06-01";
const readToken = process.env.SANITY_API_READ_TOKEN;

// Falls back to a placeholder id so createClient doesn't throw before a real
// Sanity project is connected — callers must check `projectId` before fetching.
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

// Used by routes that support Presentation Tool live preview. Drafts are
// never publicly readable, so this only switches perspective when preview
// is actually requested AND a read token is configured — otherwise callers
// silently keep reading published content, same as always.
export function getClient(preview: boolean) {
  if (!preview || !readToken) return client;
  return client.withConfig({
    token: readToken,
    perspective: "drafts",
    useCdn: false,
  });
}
