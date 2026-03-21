import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './sanity/schema'
import { PreviewPane } from './sanity/components/preview-pane'

// All types that have a live preview page
const PREVIEWABLE = ['homepage', 'about', 'services', 'siteSettings', 'project', 'blogPost']

// Singleton document types — only one instance allowed
const SINGLETONS = ['homepage', 'siteSettings', 'about', 'services']

// ── Preview URL resolver ───────────────────────────────────────────────────
const secret = process.env.SANITY_PREVIEW_SECRET ?? ''
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wearenotcreative.com'

function previewUrl(slug: string) {
    return `${siteOrigin}/api/draft?secret=${secret}&slug=${slug}`
}

function resolvePreviewUrl(doc: { _type?: string; slug?: string | { current?: string } } | undefined): string {
    if (!doc || !doc._type) return '/'
    // slug is stored as plain string in these schemas (type:'string'), not a slug object
    const s = typeof doc.slug === 'string' ? doc.slug : doc.slug?.current
    switch (doc._type) {
        case 'project':
            return previewUrl(s ? `/projects/${s}` : '/')
        case 'blogPost':
            return previewUrl('/blog')
        case 'about':
            return previewUrl('/about')
        case 'services':
            return previewUrl('/services')
        case 'homepage':
            return previewUrl('/')
        case 'siteSettings':
            return previewUrl('/contact')
        default:
            return previewUrl('/')
    }
}

export default defineConfig({
    basePath: '/studio',
    projectId: '4qdgb5lz',
    dataset: 'production',
    schema,
    document: {
        productionUrl: resolvePreviewUrl,
    },
    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        // ── SITE ─────────────────────────────────────
                        S.listItem()
                            .title('SITE')
                            .child(
                                S.list()
                                    .title('Site')
                                    .items([
                                        S.listItem()
                                            .title('Homepage')
                                            .id('homepage')
                                            .child(
                                                S.document()
                                                    .schemaType('homepage')
                                                    .documentId('homepage')
                                                    .title('Homepage')
                                                    .views([
                                                        S.view.form().title('Edit'),
                                                        S.view.component(PreviewPane).title('Preview'),
                                                    ])
                                            ),
                                        S.listItem()
                                            .title('About Page')
                                            .id('about')
                                            .child(
                                                S.document()
                                                    .schemaType('about')
                                                    .documentId('about')
                                                    .title('About Page')
                                                    .views([
                                                        S.view.form().title('Edit'),
                                                        S.view.component(PreviewPane).title('Preview'),
                                                    ])
                                            ),
                                        S.listItem()
                                            .title('Services Page')
                                            .id('services')
                                            .child(
                                                S.document()
                                                    .schemaType('services')
                                                    .documentId('services')
                                                    .title('Services Page')
                                                    .views([
                                                        S.view.form().title('Edit'),
                                                        S.view.component(PreviewPane).title('Preview'),
                                                    ])
                                            ),
                                        S.listItem()
                                            .title('Site Settings')
                                            .id('siteSettings')
                                            .child(
                                                S.document()
                                                    .schemaType('siteSettings')
                                                    .documentId('siteSettings')
                                                    .title('Site Settings')
                                                    .views([
                                                        S.view.form().title('Edit'),
                                                        S.view.component(PreviewPane).title('Preview'),
                                                    ])
                                            ),
                                    ])
                            ),

                        S.divider(),

                        // ── CONTENT ───────────────────────────────────
                        S.listItem()
                            .title('CONTENT')
                            .child(
                                S.list()
                                    .title('Content')
                                    .items([
                                        S.listItem()
                                            .title('Projects')
                                            .child(
                                                S.documentTypeList('project')
                                                    .title('Projects')
                                                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                                                    .child((documentId) =>
                                                        S.document()
                                                            .documentId(documentId)
                                                            .schemaType('project')
                                                            .views([
                                                                S.view.form().title('Edit'),
                                                                S.view.component(PreviewPane).title('Preview'),
                                                            ])
                                                    )
                                            ),
                                        S.listItem()
                                            .title('Blog')
                                            .child(
                                                S.documentTypeList('blogPost')
                                                    .title('Blog Posts')
                                                    .child((documentId) =>
                                                        S.document()
                                                            .documentId(documentId)
                                                            .schemaType('blogPost')
                                                            .views([
                                                                S.view.form().title('Edit'),
                                                                S.view.component(PreviewPane).title('Preview'),
                                                            ])
                                                    )
                                            ),
                                    ])
                            ),
                    ]),

            // Add Preview tab to all previewable types (fallback for any document opened outside structure)
            defaultDocumentNode: (S, { schemaType }) => {
                if (PREVIEWABLE.includes(schemaType)) {
                    return S.document().views([
                        S.view.form().title('Edit'),
                        S.view.component(PreviewPane).title('Preview'),
                    ])
                }
                return S.document()
            },
        }),
    ],
})
