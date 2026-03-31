import { defineField, defineType } from 'sanity'

export const serviceTag = defineType({
    name: 'serviceTag',
    title: 'Service Tag',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Service Name',
            type: 'string',
            description: 'e.g. "Brand Identity", "Art Direction", "Digital". This name appears in project filters.',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: 'Sort Order',
            type: 'number',
            description: 'Controls the order in the filter dropdown. Lower numbers appear first.',
            initialValue: 0,
        }),
    ],
    orderings: [
        {
            title: 'Sort Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: { title: 'name', subtitle: 'order' },
        prepare({ title, subtitle }: any) {
            return { title: title || 'Unnamed Service', subtitle: subtitle !== undefined ? `Order: ${subtitle}` : '' }
        },
    },
})
