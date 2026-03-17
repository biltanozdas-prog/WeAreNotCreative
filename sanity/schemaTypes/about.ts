import { defineField, defineType } from 'sanity'

export const about = defineType({
    name: 'about',
    title: 'About Page',
    type: 'document',
    fields: [
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
