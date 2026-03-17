import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './sanity/schema'

// Singleton document types — only one instance allowed
const SINGLETONS = ['siteSettings', 'about', 'services']

export default defineConfig({
    basePath: '/studio',
    projectId: '4qdgb5lz',
    dataset: 'production',
    schema,
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
                                            .title('Site Settings')
                                            .id('siteSettings')
                                            .child(
                                                S.document()
                                                    .schemaType('siteSettings')
                                                    .documentId('siteSettings')
                                                    .title('Site Settings')
                                            ),
                                        S.listItem()
                                            .title('About Page')
                                            .id('about')
                                            .child(
                                                S.document()
                                                    .schemaType('about')
                                                    .documentId('about')
                                                    .title('About Page')
                                            ),
                                        S.listItem()
                                            .title('Services Page')
                                            .id('services')
                                            .child(
                                                S.document()
                                                    .schemaType('services')
                                                    .documentId('services')
                                                    .title('Services Page')
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
                                            ),
                                        S.listItem()
                                            .title('Blog')
                                            .child(
                                                S.documentTypeList('blogPost')
                                                    .title('Blog Posts')
                                            ),
                                    ])
                            ),
                    ]),

            // Prevent new documents being created for singleton types
            defaultDocumentNode: (S, { schemaType }) => {
                if (SINGLETONS.includes(schemaType)) {
                    return S.document().views([S.view.form()])
                }
                return S.document()
            },
        }),
    ],
})
