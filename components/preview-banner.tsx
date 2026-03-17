import { draftMode } from "next/headers"
import Link from "next/link"

export async function PreviewBanner() {
    const { isEnabled } = await draftMode()
    if (!isEnabled) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-foreground text-background flex items-center justify-between px-6 py-3">
            <span className="font-sans font-medium text-[11px] uppercase tracking-[0.25em]">
                Preview Mode — Unpublished content is visible
            </span>
            <Link
                href="/api/exit-preview"
                className="font-sans font-medium text-[11px] uppercase tracking-[0.15em] border-b border-background hover:opacity-60 transition-opacity"
            >
                Exit Preview
            </Link>
        </div>
    )
}
