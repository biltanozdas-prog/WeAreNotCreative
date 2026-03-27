import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("sanity-webhook-signature")
    const secret = process.env.SANITY_REVALIDATE_SECRET

    // 1. Secret Validation - Simple token auth if signature check is too complex, 
    // but Sanity recommends verifying the signature. Here we do a basic token check in query 
    // or header since we don't have `@sanity/webhook` installed natively.
    const url = new URL(req.url)
    const token = url.searchParams.get("secret")
    
    if (token !== secret) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
    }

    // 2. Payload Validation
    const body = await req.json()
    const { _type, slug } = body

    if (!_type) {
      return NextResponse.json({ message: "Bad Request: Missing _type" }, { status: 400 })
    }

    // 3. Document type whitelisting
    const allowedTypes = ["homepage", "about", "services", "siteSettings", "project", "blogPost"]
    if (!allowedTypes.includes(_type)) {
      return NextResponse.json({ message: `Ignored: document type ${_type} not whitelisted` }, { status: 200 })
    }

    // Revalidate the Next.js cache tag matching the Sanity document type.
    // @ts-ignore NextJS 16 signature mismatch
    revalidateTag(_type)
    
    // Optionally revalidate slug based paths for granular cache clearing if we used `revalidatePath`.
    // revalidatePath(`/${_type === 'project' ? 'projects/' + slug?.current : _type}`)

    return NextResponse.json({ revalidated: true, now: Date.now(), type: _type })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
