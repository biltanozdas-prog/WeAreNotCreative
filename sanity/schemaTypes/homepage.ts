import { defineField, defineType } from 'sanity'

export const homepage = defineType({
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        // ── Hero ──────────────────────────────────────────────────
        defineField({
            name: 'heroVideo',
            title: 'Homepage — Hero Video',
            type: 'file',
            description: 'Full-screen video that plays on the homepage background. Upload an MP4 file. Recommended: short loop, no audio needed.',
            options: {
                accept: 'video/*',
            },
        }),

        // ── Manifesto ─────────────────────────────────────────────
        defineField({
            name: 'headline',
            title: 'Homepage — Headline',
            type: 'string',
            description: 'The large heading in the manifesto section. Shown in all-caps below the hero video. Example: "Design as a cultural practice."',
        }),
        defineField({
            name: 'manifestoText',
            title: 'Homepage — Manifesto Text',
            type: 'text',
            rows: 4,
            description: 'The paragraph of body text below the headline. Describes the studio\'s mission. Shown indented below the heading.',
        }),

        // ── Projects ──────────────────────────────────────────────
        defineField({
            name: 'selectedProjects',
            title: 'Homepage — Featured Projects',
            type: 'array',
            description: 'Projects shown in the scrolling showcase on the homepage. Leave empty to show the 4 most recent published projects automatically.',
            of: [{ type: 'reference', to: [{ type: 'project' }] }],
        }),

        // ── Footer CTA ────────────────────────────────────────────
        defineField({
            name: 'ctaLabel',
            title: 'CTA Section — Eyebrow Label',
            type: 'string',
            description: 'Small uppercase label above the CTA heading at the bottom of the page. Default appearance: "Next Step".',
        }),
        defineField({
            name: 'ctaHeadline',
            title: 'CTA Section — Headline',
            type: 'string',
            description: 'Large heading in the footer CTA block. Default appearance: "LET\'S TALK."',
        }),
        defineField({
            name: 'ctaButtonText',
            title: 'CTA Section — Button Text',
            type: 'string',
            description: 'Link text in the CTA block. Default appearance: "Start a Conversation".',
        }),

        // ── Optional ──────────────────────────────────────────────
        defineField({
            name: 'aboutText',
            title: 'Homepage — About Preview (optional)',
            type: 'text',
            rows: 3,
            description: 'Short teaser text for the About section on the homepage. Leave blank if not used.',
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Homepage' }
        },
    },
})
