import { NextResponse } from "next/server"

// TEMPORARY DEBUG ENDPOINT — remove after verifying env vars are loaded
export async function GET() {
  return NextResponse.json({
    previewSecretExists: !!process.env.SANITY_PREVIEW_SECRET,
    apiTokenExists: !!process.env.SANITY_API_TOKEN,
  })
}
