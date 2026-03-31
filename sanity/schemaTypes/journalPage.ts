import { defineField, defineType } from 'sanity'

export const journalPage = defineType({
    name: 'journalPage',
    title: 'Journal Page',
    type: 'document',
    fields: [
        defineField({
            name: 'eyebrowLabel',
            title: 'Page Eyebrow Label',
            type: 'string',
            description: 'Small label shown above the headline. Default appearance: "Observations".',
        }),
        defineField({
            name: 'headline',
            title: 'Page Headline',
            type: 'string',
            description: 'Large heading at the top of the Journal page. Default appearance: "JOURNAL".',
        }),
        defineField({
            name: 'intro',
            title: 'Intro Text',
            type: 'text',
            rows: 3,
            description: 'Short paragraph shown below the headline.',
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Journal Page' }
        },
    },
})
