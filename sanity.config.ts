import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schema } from './sanity/schema'

export default defineConfig({
    basePath: '/studio',
    projectId: "4qdgb5lz",
    dataset: "production",
    schema,
    plugins: [
        deskTool(),
    ],
})
