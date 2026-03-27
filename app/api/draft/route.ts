import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get("secret")
    const slug = searchParams.get("slug") || "/"

    // Validate secret
    const expectedSecret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || process.env.SANITY_PREVIEW_SECRET
    if (!secret || secret !== expectedSecret) {
        return new Response(`Invalid preview secret. Vercel Server Expected: "${expectedSecret}". Browser Sent: "${secret}". Check your Vercel Environment Variables.`, { status: 401 })
    }

    const dm = await draftMode()
    dm.enable()

    // Redirect to the requested page (or homepage)
    redirect(slug)
}
