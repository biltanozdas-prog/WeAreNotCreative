import { defineField, defineType } from 'sanity'

export const services = defineType({
    name: 'services',
    title: 'Services Page',
    type: 'document',
    fields: [
        defineField({
            name: 'eyebrowLabel',
            title: 'Page Eyebrow Label',
            type: 'string',
            description: 'Small uppercase label shown above the headline. Default appearance: "What We Do".',
        }),
        defineField({
            name: 'headline',
            title: 'Page Headline',
            type: 'string',
            description: 'The large heading shown at the top of the Services page. Usually "SERVICES".',
            validation: (Rule) => Rule.required().error('Headline is required.'),
        }),
        defineField({
            name: 'intro',
            title: 'Intro Text',
            type: 'text',
            description: 'A short paragraph shown below the headline. Describes what the studio offers.',
        }),
        defineField({
            name: 'disciplines',
            title: 'Services',
            type: 'array',
            description: 'Each service is displayed as an expandable row. Click [ + ] to add or reorder services.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'number',
                            title: 'Number',
                            type: 'string',
                            description: 'Display label, e.g. "01", "02". Used for visual ordering only.',
                        }),
                        defineField({
                            name: 'label',
                            title: 'Service Name',
                            type: 'string',
                            description: 'The name shown in the expandable row header.',
                            validation: (Rule) => Rule.required().error('Service name is required.'),
                        }),
                        defineField({
                            name: 'statement',
                            title: 'Short Description',
                            type: 'text',
                            description: 'One sentence describing this service. Shown when the row is expanded.',
                        }),
                        defineField({
                            name: 'deliverables',
                            title: 'Deliverables',
                            type: 'array',
                            of: [{ type: 'string' }],
                            description: 'List of specific outputs for this service. Shown as tags when expanded.',
                        }),
                        defineField({
                            name: 'order',
                            title: 'Sort Order',
                            type: 'number',
                            description: 'Controls display order. Lower numbers appear first (1, 2, 3...).',
                        }),
                    ],
                    preview: {
                        select: { title: 'label', subtitle: 'number' },
                        prepare({ title, subtitle }: any) {
                            return { title: title || 'Service', subtitle: subtitle || '' }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'process',
            title: 'Our Process',
            type: 'array',
            description: 'The steps of the studio process shown on the Services page.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'step',
                            title: 'Step Number',
                            type: 'string',
                            description: 'e.g. "01", "02".',
                        }),
                        defineField({
                            name: 'title',
                            title: 'Step Title',
                            type: 'string',
                            description: 'e.g. "Research", "Concept".',
                        }),
                        defineField({
                            name: 'text',
                            title: 'Step Description',
                            type: 'text',
                        }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'step' },
                        prepare({ title, subtitle }: any) {
                            return { title: title || 'Process Step', subtitle: subtitle || '' }
                        },
                    },
                },
            ],
        }),

        // ── Footer CTA ────────────────────────────────────────────
        defineField({
            name: 'ctaLabel',
            title: 'CTA Section — Eyebrow Label',
            type: 'string',
            description: 'Small label above the CTA heading at the bottom of the page. Default appearance: "Ready?".',
        }),
        defineField({
            name: 'ctaHeadline',
            title: 'CTA Section — Headline',
            type: 'string',
            description: 'Large CTA heading. Default appearance: "LET\'S BUILD SOMETHING."',
        }),
        defineField({
            name: 'ctaButtonText',
            title: 'CTA Section — Button Text',
            type: 'string',
            description: 'Link text in the CTA block. Default appearance: "Start a Project".',
        }),
    ],
})
