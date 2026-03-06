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
    fields: [
        defineField({ name: 'leftContent', title: 'Left Content', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'rightImage', title: 'Right Image', type: 'image' }),
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
