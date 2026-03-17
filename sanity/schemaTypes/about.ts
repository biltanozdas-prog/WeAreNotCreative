import { defineField, defineType } from 'sanity'

export const about = defineType({
    name: 'about',
    title: 'About Page',
    type: 'document',
    fields: [
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
            description: 'Main heading displayed on the About page (e.g. "ABOUT").',
        }),
        defineField({
            name: 'intro',
            title: 'Intro Text',
            type: 'text',
            description: 'Studio introduction paragraph.',
        }),
        defineField({
            name: 'positioning',
            title: 'Positioning Columns',
            type: 'array',
            description: 'Three short positioning statements shown below the intro.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Column Title', type: 'string' }),
                        defineField({ name: 'text', title: 'Column Text', type: 'text' }),
                    ],
                    preview: {
                        select: { title: 'title' },
                        prepare({ title }: any) {
                            return { title: title || 'Positioning Item' }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'galleryImages',
            title: 'Studio Gallery Images',
            description: 'Interior photos shown in the slider on the About page.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                            description: 'Optional description for accessibility.',
                        }),
                    ],
                    preview: {
                        select: { title: 'alt', media: 'image' },
                        prepare({ title, media }: any) {
                            return { title: title || 'Gallery Image', media }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'showTeamSection',
            title: 'Show Team Section',
            type: 'boolean',
            description: 'Toggle the Team section on the About page. Team data is preserved when hidden.',
            initialValue: true,
        }),
    ],
})
