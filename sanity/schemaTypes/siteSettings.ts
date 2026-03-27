import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'contactEyebrow',
            title: 'Contact Page — Eyebrow Label',
            type: 'string',
            description: 'Small label shown above the email address. Default appearance: "Start a Project".',
        }),
        defineField({
            name: 'contactDescription',
            title: 'Contact Page — Description',
            type: 'text',
            rows: 3,
            description: 'Short paragraph shown below the email address on the Contact page.',
        }),
        defineField({
            name: 'email',
            title: 'Contact Email',
            type: 'string',
            description: 'The main contact email address. Shown as a large link on the Contact page.',
        }),
        defineField({
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
            description: 'Optional phone number displayed on the Contact page.',
        }),
        defineField({
            name: 'location',
            title: 'Studio Location',
            type: 'string',
            description: 'Short location text shown at the bottom of the Contact page, e.g. "Istanbul / Global".',
        }),
        defineField({
            name: 'instagramUrl',
            title: 'Instagram Link',
            type: 'string',
            description: 'Full URL to the Instagram profile, e.g. "https://instagram.com/wearenotcreative".',
        }),
        defineField({
            name: 'inquiryCategories',
            title: 'Inquiry Categories',
            type: 'array',
            description: 'Three columns shown on the Contact page explaining different types of inquiries.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Category Name',
                            type: 'string',
                            description: 'e.g. "New Projects", "Collaborations", "General".',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Category Description',
                            type: 'text',
                            description: 'Short text explaining what kind of inquiry this covers.',
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
