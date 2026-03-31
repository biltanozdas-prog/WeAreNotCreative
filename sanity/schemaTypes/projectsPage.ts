import { defineField, defineType } from 'sanity'

export const projectsPage = defineType({
    name: 'projectsPage',
    title: 'Projects Page',
    type: 'document',
    fields: [
        defineField({
            name: 'eyebrowLabel',
            title: 'Page Eyebrow Label',
            type: 'string',
            description: 'Small label shown above the project count. Default appearance: "Index".',
        }),
        defineField({
            name: 'intro',
            title: 'Intro Text',
            type: 'text',
            rows: 2,
            description: 'Short paragraph shown below the header. Default appearance: "A curated selection across disciplines..."',
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Projects Page' }
        },
    },
})
