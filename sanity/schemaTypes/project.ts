import { defineField, defineType } from 'sanity'

export const project = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'client',
            title: 'Client',
            type: 'string',
        }),
        defineField({
            name: 'industry',
            title: 'Industry',
            type: 'string',
        }),
        defineField({
            name: 'services',
            title: 'Services',
            type: 'array',
            description: 'Select from the defined Service Tags. These drive the filter on the Projects page.',
            of: [{ type: 'reference', to: [{ type: 'serviceTag' }] }],
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
        }),
        defineField({
            name: 'published',
            title: 'Published',
            type: 'boolean',
            initialValue: false,
            description: 'Toggle on to make this project visible on the live site.',
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
        }),
        defineField({
            name: 'blocks',
            title: 'Blocks',
            type: 'array',
            of: [
                { type: 'heroOverride' },
                { type: 'fullImage' },
                { type: 'fullVideo' },
                { type: 'textBlock' },
                { type: 'twoColumn' },
                { type: 'gallery' },
                { type: 'quote' },
                { type: 'spacer' },
            ],
        }),
    ],
})
