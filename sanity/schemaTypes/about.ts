import { defineField, defineType } from 'sanity'

export const about = defineType({
    name: 'about',
    title: 'About Page',
    type: 'document',
    fields: [
        defineField({
            name: 'eyebrowLabel',
            title: 'Page Eyebrow Label',
            type: 'string',
            description: 'Small uppercase label shown above the headline. Default appearance: "Who We Are".',
        }),
        defineField({
            name: 'headline',
            title: 'Page Headline',
            type: 'string',
            description: 'The large heading shown at the top of the About page. Usually "ABOUT".',
            validation: (Rule) => Rule.required().error('Headline is required.'),
        }),
        defineField({
            name: 'intro',
            title: 'Studio Introduction',
            type: 'text',
            description: 'A short paragraph introducing the studio. Shown below the headline.',
        }),
        defineField({
            name: 'positioning',
            title: 'Positioning Columns',
            type: 'array',
            description: 'Three short statements that define the studio\'s positioning. Shown in columns below the intro text.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Column Heading',
                            type: 'string',
                            description: 'e.g. "We Work With", "Philosophy"',
                        }),
                        defineField({
                            name: 'text',
                            title: 'Column Text',
                            type: 'text',
                            description: 'Short description for this positioning column.',
                        }),
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
            title: 'Studio Gallery',
            description: 'Photos displayed in the image slider on the right side of the About page. Upload multiple images — they will cycle automatically.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'image',
                            title: 'Photo',
                            type: 'image',
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'alt',
                            title: 'Image Description',
                            type: 'string',
                            description: 'Describe the photo briefly (for accessibility). Optional.',
                        }),
                    ],
                    preview: {
                        select: { title: 'alt', media: 'image' },
                        prepare({ title, media }: any) {
                            return { title: title || 'Gallery Photo', media }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'showTeamSection',
            title: 'Show Team Section',
            type: 'boolean',
            description: 'Turn on to display the team member list on the About page.',
            initialValue: true,
        }),
        defineField({
            name: 'teamMembers',
            title: 'Team Members',
            type: 'array',
            description: 'List of team members shown on the About page when the Team section is visible.',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Name',
                            type: 'string',
                        }),
                        defineField({
                            name: 'title',
                            title: 'Job Title',
                            type: 'string',
                        }),
                        defineField({
                            name: 'image',
                            title: 'Profile Image',
                            type: 'image',
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'shortBio',
                            title: 'Short Bio',
                            type: 'text',
                            description: 'Shown directly on the team card.',
                        }),
                        defineField({
                            name: 'fullBio',
                            title: 'Full Bio',
                            type: 'text',
                            description: 'Shown in the expanded lightbox view.',
                        }),
                    ],
                    preview: {
                        select: { title: 'name', subtitle: 'title', media: 'image' },
                    },
                },
            ],
        }),

        // ── Footer CTA ────────────────────────────────────────────
        defineField({
            name: 'ctaLabel',
            title: 'CTA Section — Eyebrow Label',
            type: 'string',
            description: 'Small label above the CTA heading at the bottom of the page. Default appearance: "Collaborate".',
        }),
        defineField({
            name: 'ctaHeadline',
            title: 'CTA Section — Headline',
            type: 'string',
            description: 'Large CTA heading. Default appearance: "WORK WITH US."',
        }),
        defineField({
            name: 'ctaButtonText',
            title: 'CTA Section — Button Text',
            type: 'string',
            description: 'Link text in the CTA block. Default appearance: "Start a Conversation".',
        }),
    ],
})
