import { type SchemaTypeDefinition } from 'sanity'

import { project } from './schemaTypes/project'
import { blogPost } from './schemaTypes/blogPost'
import { homepage } from './schemaTypes/homepage'
import { about } from './schemaTypes/about'
import { services } from './schemaTypes/services'
import { siteSettings } from './schemaTypes/siteSettings'
import { journalPage } from './schemaTypes/journalPage'
import { projectsPage } from './schemaTypes/projectsPage'
import {
    heroOverride,
    fullImage,
    fullVideo,
    textBlock,
    twoColumn,
    gallery,
    quote,
    spacer,
} from './schemaTypes/blocks'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        project,
        blogPost,
        homepage,
        about,
        services,
        siteSettings,
        journalPage,
        projectsPage,
        heroOverride,
        fullImage,
        fullVideo,
        textBlock,
        twoColumn,
        gallery,
        quote,
        spacer,
    ],
}
