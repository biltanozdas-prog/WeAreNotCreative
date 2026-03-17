import { defineField, defineType } from 'sanity'

export const services = defineType({
    name: 'services',
    title: 'Services Page',
    type: 'document',
    fields: [
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
            description: 'Main heading displayed on the Services page (e.g. "SERVICES").',
        }),
        defineField({
            name: 'intro',
            title: 'Intro Text',
            type: 'text',
            description: 'Short paragraph shown below the headline.',
        }),
        defineField({
            name: 'disciplines',
            title: 'Disciplines',
            type: 'array',
            description: 'List of service disciplines shown as expandable rows.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'number',
                            title: 'Number',
                            type: 'string',
                            description: 'Display number (e.g. "01").',
                        }),
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                            description: 'Service name shown in the accordion header.',
                        }),
                        defineField({
                            name: 'statement',
                            title: 'Statement',
                            type: 'text',
                            description: 'One-line description shown when expanded.',
                        }),
                        defineField({
                            name: 'deliverables',
                            title: 'Deliverables',
                            type: 'array',
                            of: [{ type: 'string' }],
                            description: 'List of deliverables shown as tags when expanded.',
                        }),
                        defineField({
                            name: 'order',
                            title: 'Order',
                            type: 'number',
                            description: 'Sort order (ascending). Lower numbers appear first.',
                        }),
                    ],
                    preview: {
                        select: { title: 'label', subtitle: 'number' },
                        prepare({ title, subtitle }: any) {
                            return { title: title || 'Discipline', subtitle: subtitle || '' }
                        },
                    },
                },
            ],
        }),
    ],
})
