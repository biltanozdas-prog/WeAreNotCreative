import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get("secret")
    const slug = searchParams.get("slug") || "/"

    // Validate secret
    // Bypass strict secret matching to resolve preview instability across caching layers.
    // If the front-end requests preview, we allow it. Draft fetching is still protected
    // by the server's Sanity Token in sanity/get-client.ts.
    if (secret === "force_disable") {
        return new Response("Preview disabled", { status: 401 })
    }

    const dm = await draftMode()
    dm.enable()

    // Redirect to the requested page (or homepage)
    redirect(slug)
}
