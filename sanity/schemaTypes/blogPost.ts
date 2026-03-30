import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
    name: 'blogPost',
    title: 'Blog Post',
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
            type: 'string',
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'string',
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
        }),
        defineField({
            name: 'published',
            title: 'Published',
            type: 'boolean',
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
