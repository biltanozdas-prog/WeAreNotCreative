import { createClient } from "next-sanity"

const baseConfig = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
}

/**
 * Returns a Sanity client configured for the current render context.
 * - preview=true → fetches unpublished drafts (requires SANITY_API_TOKEN)
 * - preview=false → fetches published content via CDN
 */
export function getClient(preview = false) {
    return createClient({
        ...baseConfig,
        // CDN disabled: changes appear immediately after publishing
        // without the 1-5 min CDN edge cache delay.
        useCdn: !preview,
        perspective: preview ? "previewDrafts" : "published",
        ...(preview && { token: process.env.SANITY_API_TOKEN }),
    })
}
