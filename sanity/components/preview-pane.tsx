'use client'

import React, { useEffect, useState } from 'react'

const SITE_ORIGIN =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.wearenotcreativestudio.com'

const SECRET = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || process.env.SANITY_PREVIEW_SECRET || 'wanc-preview-9384jsdfkjsdf'

// Map document type → site path
function resolveSlug(doc: any): string {
    if (!doc || !doc._type) return '/'
    const s = typeof doc.slug === 'string' ? doc.slug : doc.slug?.current
    switch (doc._type) {
        case 'project':
            return s ? `/projects/${s}` : '/'
        case 'blogPost':
            return s ? `/journal/${s}` : '/journal'
        case 'about':
            return '/about'
        case 'services':
            return '/services'
        case 'homepage':
            return '/'
        case 'siteSettings':
            return '/contact'
        case 'journalPage':
            return '/journal'
        case 'projectsPage':
            return '/projects'
        default:
            return '/'
    }
}

interface PreviewPaneProps {
    document: {
        displayed: any
    }
}

export function PreviewPane({ document: { displayed } }: PreviewPaneProps) {
    const slug = resolveSlug(displayed)
    const previewUrl = `${SITE_ORIGIN}/api/draft?secret=${SECRET}&slug=${slug}`

    const [iframeUrl, setIframeUrl] = useState<string | null>(null)

    useEffect(() => {
        // Small delay so editor changes settle before we ping the preview
        const timer = setTimeout(() => setIframeUrl(previewUrl), 300)
        return () => clearTimeout(timer)
    }, [previewUrl])

    if (!iframeUrl) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#999',
                    fontFamily: 'sans-serif',
                    fontSize: 14,
                }}
            >
                Loading preview…
            </div>
        )
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <iframe
                key={iframeUrl}
                src={iframeUrl}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                }}
                title="Live Preview"
            />
            {/* Refresh button */}
            <a
                href={iframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontFamily: 'sans-serif',
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                }}
            >
                Open in new tab ↗
            </a>
        </div>
    )
}
