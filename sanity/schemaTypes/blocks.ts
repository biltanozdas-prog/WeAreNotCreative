import { defineField, defineType } from 'sanity'

export const heroOverride = defineType({
    name: 'heroOverride',
    title: 'Hero Override',
    type: 'object',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'image', title: 'Background Image', type: 'image' }),
    ],
})

export const fullImage = defineType({
    name: 'fullImage',
    title: 'Full Image',
    type: 'object',
    fields: [
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    ],
})

export const fullVideo = defineType({
    name: 'fullVideo',
    title: 'Full Video',
    type: 'object',
    fields: [
        defineField({ 
            name: 'video', 
            title: 'Video File', 
            type: 'file', 
            options: { accept: 'video/*' } 
        }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    ],
})

export const textBlock = defineType({
    name: 'textBlock',
    title: 'Text Block',
    type: 'object',
    fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
    ],
})

export const twoColumn = defineType({
    name: 'twoColumn',
    title: 'Two Column',
    type: 'object',
    description: 'Side-by-side layout. Each column can hold text, an image, or a video independently.',
    fields: [
        // ── LEFT COLUMN ───────────────────────────────────────────
        defineField({
            name: 'leftType',
            title: 'Left Column — Content Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Text', value: 'text' },
                    { title: 'Image', value: 'image' },
                    { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
            },
            initialValue: 'text',
        }),
        defineField({
            name: 'leftContent',
            title: 'Left Column — Text',
            type: 'array',
            of: [{ type: 'block' }],
            hidden: ({ parent }) => parent?.leftType !== 'text' && parent?.leftType !== undefined,
        }),
        defineField({
            name: 'leftImage',
            title: 'Left Column — Image',
            type: 'image',
            hidden: ({ parent }) => parent?.leftType !== 'image',
        }),
        defineField({
            name: 'leftVideo',
            title: 'Left Column — Video',
            type: 'file',
            options: { accept: 'video/*' },
            hidden: ({ parent }) => parent?.leftType !== 'video',
        }),

        // ── RIGHT COLUMN ──────────────────────────────────────────
        defineField({
            name: 'rightType',
            title: 'Right Column — Content Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Text', value: 'text' },
                    { title: 'Image', value: 'image' },
                    { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
            },
            initialValue: 'image',
        }),
        defineField({
            name: 'rightContent',
            title: 'Right Column — Text',
            type: 'array',
            of: [{ type: 'block' }],
            hidden: ({ parent }) => parent?.rightType !== 'text',
        }),
        defineField({
            name: 'rightImage',
            title: 'Right Column — Image',
            type: 'image',
            hidden: ({ parent }) => parent?.rightType !== 'image' && parent?.rightType !== undefined,
        }),
        defineField({
            name: 'rightVideo',
            title: 'Right Column — Video',
            type: 'file',
            options: { accept: 'video/*' },
            hidden: ({ parent }) => parent?.rightType !== 'video',
        }),
    ],
})

export const gallery = defineType({
    name: 'gallery',
    title: 'Image Grid',
    type: 'object',
    fields: [
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image' }],
        }),
    ],
})

export const quote = defineType({
    name: 'quote',
    title: 'Quote',
    type: 'object',
    fields: [
        defineField({ name: 'quoteText', title: 'Quote Text', type: 'text' }),
        defineField({ name: 'author', title: 'Author', type: 'string' }),
    ],
})

export const spacer = defineType({
    name: 'spacer',
    title: 'Spacer',
    type: 'object',
    fields: [
        defineField({
            name: 'size',
            title: 'Size',
            type: 'string',
            options: {
                list: [
                    { title: 'Small', value: 'small' },
                    { title: 'Medium', value: 'medium' },
                    { title: 'Large', value: 'large' },
                ],
            },
        }),
    ],
})
