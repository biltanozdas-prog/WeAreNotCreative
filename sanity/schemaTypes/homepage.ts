import { defineField, defineType } from 'sanity'

export const homepage = defineType({
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        defineField({
            name: 'heroVideo',
            title: 'Hero Video',
            type: 'string',
        }),
        defineField({
            name: 'introText',
            title: 'Intro Text',
            type: 'text',
        }),
        defineField({
            name: 'selectedProjects',
            title: 'Selected Projects',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'project' }] }],
        }),
        defineField({
            name: 'services',
            title: 'Services',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'headline', type: 'string' },
                        { name: 'intro', type: 'text' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'aboutText',
            title: 'About Text',
            type: 'text',
        }),
    ],
})
