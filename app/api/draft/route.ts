import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get("secret")
    const slug = searchParams.get("slug") || "/"

    // Validate secret
    if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
        return new Response("Invalid or missing preview secret.", { status: 401 })
    }

    const dm = await draftMode()
    dm.enable()

    // Redirect to the requested page (or homepage)
    redirect(slug)
}
