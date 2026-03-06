import { type SchemaTypeDefinition } from 'sanity'

import { project } from './schemaTypes/project'
import { blogPost } from './schemaTypes/blogPost'
import { homepage } from './schemaTypes/homepage'
import {
    heroOverride,
    fullImage,
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
        heroOverride,
        fullImage,
        textBlock,
        twoColumn,
        gallery,
        quote,
        spacer,
    ],
}
