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
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            description: 'Use the date picker. Existing string-format dates must be re-entered.',
        }),
        defineField({
            name: 'postType',
            title: 'Yazı Türü',
            type: 'string',
            options: {
                list: [
                    { title: 'Essay', value: 'essay' },
                    { title: 'Observation', value: 'observation' },
                    { title: 'Reference', value: 'reference' },
                ],
                layout: 'radio',
            },
            initialValue: 'essay',
        }),
        defineField({
            name: 'author',
            title: 'Yazar',
            type: 'string',
            initialValue: 'Tunç',
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
            initialValue: false,
            description: 'Toggle on to make this post visible on the live site.',
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
