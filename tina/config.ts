import { defineConfig } from "tinacms"

// Your hosting provider likely exposes this as an environment variable
const branch =
    process.env.GITHUB_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "main"

export default defineConfig({
    branch,
    // Get this from tina.io
    // @ts-ignore
    clientId: null,
    // @ts-ignore
    token: null,

    build: {
        outputFolder: "admin",
        publicFolder: "public",
    },

    media: {
        tina: {
            mediaRoot: "uploads",
            publicFolder: "public",
        },
    },

    // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
    schema: {
        collections: [
            {
                name: "homepage",
                label: "Homepage",
                path: "content",
                match: {
                    include: "homepage",
                },
                format: "json",
                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },
                fields: [
                    {
                        type: "string",
                        name: "heroVideo",
                        label: "Hero Video URL",
                        required: true,
                    },
                ],
            },
            {
                name: "services",
                label: "Services",
                path: "content",
                match: {
                    include: "services",
                },
                format: "json",
                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },
                fields: [
                    { type: "string", name: "headline", label: "Headline" },
                    { type: "string", name: "intro", label: "Intro Text", ui: { component: "textarea" } },
                    {
                        type: "object",
                        name: "disciplines",
                        label: "Disciplines",
                        list: true,
                        ui: {
                            itemProps: (item) => { return { label: item?.label } }
                        },
                        fields: [
                            { type: "string", name: "number", label: "Number (e.g. 01)" },
                            { type: "string", name: "label", label: "Label" },
                            { type: "string", name: "statement", label: "Statement", ui: { component: "textarea" } },
                            { type: "string", name: "deliverables", label: "Deliverables", list: true },
                        ],
                    },
                    {
                        type: "object",
                        name: "process",
                        label: "Process Steps",
                        list: true,
                        ui: {
                            itemProps: (item) => { return { label: item?.title } }
                        },
                        fields: [
                            { type: "string", name: "step", label: "Step Number (e.g. 01)" },
                            { type: "string", name: "title", label: "Title" },
                            { type: "string", name: "text", label: "Text", ui: { component: "textarea" } },
                        ],
                    }
                ],
            },
            {
                name: "about",
                label: "About",
                path: "content",
                match: {
                    include: "about",
                },
                format: "json",
                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },
                fields: [
                    { type: "string", name: "headline", label: "Headline" },
                    { type: "string", name: "intro", label: "Intro Text", ui: { component: "textarea" } },
                    {
                        type: "object",
                        name: "positioning",
                        label: "Positioning Details",
                        list: true,
                        ui: {
                            itemProps: (item) => { return { label: item?.title } }
                        },
                        fields: [
                            { type: "string", name: "title", label: "Title" },
                            { type: "string", name: "text", label: "Text", ui: { component: "textarea" } },
                        ]
                    }
                ],
            },
            {
                name: "team",
                label: "Team",
                path: "content",
                match: {
                    include: "team",
                },
                format: "json",
                ui: {
                    allowedActions: {
                        create: false,
                        delete: false,
                    },
                },
                fields: [
                    {
                        type: "object",
                        name: "members",
                        label: "Team Members",
                        list: true,
                        ui: {
                            itemProps: (item) => { return { label: item?.name } }
                        },
                        fields: [
                            { type: "string", name: "name", label: "Name" },
                            { type: "string", name: "title", label: "Title" },
                            { type: "image", name: "image", label: "Image" },
                            { type: "string", name: "shortBio", label: "Short Bio", ui: { component: "textarea" } },
                            { type: "string", name: "fullBio", label: "Full Bio", ui: { component: "textarea" } },
                        ]
                    }
                ],
            },
            {
                name: "blog",
                label: "Blog Posts",
                path: "content/blog",
                format: "md",
                fields: [
                    {
                        type: "boolean",
                        name: "published",
                        label: "Published",
                        description: "Check to manifest this post on the site.",
                    },
                    {
                        type: "number",
                        name: "order",
                        label: "Sort Order",
                        description: "Lower numbers appear first.",
                    },
                    {
                        type: "string",
                        name: "title",
                        label: "Title",
                        isTitle: true,
                        required: true,
                    },
                    {
                        type: "string",
                        name: "excerpt",
                        label: "Excerpt",
                        required: true,
                        ui: {
                            component: "textarea"
                        }
                    },
                    {
                        type: "string",
                        name: "date",
                        label: "Date String (e.g. Feb 2026)",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "category",
                        label: "Category",
                        required: true,
                    },
                    {
                        type: "image",
                        name: "image",
                        label: "Hero Image",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "readTime",
                        label: "Read Time",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "pullQuote",
                        label: "Pull Quote",
                    },
                    {
                        type: "image",
                        name: "contentImages",
                        label: "Content Images",
                        list: true,
                    },
                    {
                        type: "rich-text",
                        name: "body",
                        label: "Body",
                        isBody: true,
                    },
                ],
            },
            {
                name: "projects",
                label: "Projects",
                path: "content/projects",
                format: "md",
                fields: [
                    {
                        type: "boolean",
                        name: "published",
                        label: "Published",
                        description: "Check to manifest this project on the site.",
                    },
                    {
                        type: "number",
                        name: "order",
                        label: "Sort Order",
                        description: "Lower numbers appear first.",
                    },
                    {
                        type: "string",
                        name: "title",
                        label: "Title",
                        isTitle: true,
                        required: true,
                    },
                    {
                        type: "string",
                        name: "client",
                        label: "Client",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "year",
                        label: "Year",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "role",
                        label: "Role (Short)",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "category",
                        label: "Category",
                        required: true,
                    },
                    {
                        type: "image",
                        name: "image",
                        label: "Cover Image",
                        required: true,
                    },
                    {
                        type: "string",
                        name: "description",
                        label: "Description",
                        required: true,
                        ui: {
                            component: "textarea"
                        }
                    },
                    {
                        type: "string",
                        name: "roles",
                        label: "Roles",
                        list: true,
                    },
                    {
                        type: "string",
                        name: "services",
                        label: "Services",
                        list: true,
                    },
                    {
                        type: "string",
                        name: "overview",
                        label: "Overview",
                        required: true,
                        ui: {
                            component: "textarea"
                        }
                    },
                    {
                        type: "string",
                        name: "context",
                        label: "Context",
                        required: true,
                        ui: {
                            component: "textarea"
                        }
                    },
                    {
                        type: "string",
                        name: "approach",
                        label: "Approach",
                        required: true,
                        ui: {
                            component: "textarea"
                        }
                    },
                    {
                        type: "string",
                        name: "system",
                        label: "System",
                        required: true,
                        ui: {
                            component: "textarea"
                        }
                    },
                    {
                        type: "string",
                        name: "execution",
                        label: "Execution",
                        required: true,
                        ui: {
                            component: "textarea"
                        }
                    },
                    {
                        type: "string",
                        name: "outcome",
                        label: "Outcome",
                        required: true,
                        ui: {
                            component: "textarea"
                        }
                    },
                ],
            },
        ],
    },
})
