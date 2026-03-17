import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'email',
            title: 'Contact Email',
            type: 'string',
            description: 'Primary contact email shown on the Contact page.',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
            description: 'Studio location shown on the Contact page (e.g. "Istanbul / Global").',
        }),
        defineField({
            name: 'instagramUrl',
            title: 'Instagram URL',
            type: 'string',
            description: 'Full Instagram profile URL.',
        }),
        defineField({
            name: 'inquiryCategories',
            title: 'Inquiry Categories',
            type: 'array',
            description: 'Contact category columns shown below the email address.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                            description: 'Category heading (e.g. "New Projects").',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                            description: 'Short description shown below the label.',
                        }),
                    ],
                    preview: {
                        select: { title: 'label' },
                        prepare({ title }: any) {
                            return { title: title || 'Inquiry Category' }
                        },
                    },
                },
            ],
        }),
    ],
})
