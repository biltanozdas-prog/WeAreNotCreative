import { defineConfig } from "tinacms"

// Your hosting provider likely exposes this as an environment variable
const branch =
    process.env.GITHUB_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "main"

const blockTemplates: any[] = [
    {
        name: "heroOverride",
        label: "Hero Section",
        ui: { itemProps: (item: any) => ({ label: `Hero Override • ${item?.title || 'No title'}` }) },
        fields: [
            { type: "string", name: "title", label: "Title", description: "Overrides default hero title" },
            { type: "image", name: "image", label: "Background Image" }
        ]
    },
    {
        name: "fullImage",
        label: "Full Image",
        ui: { itemProps: (item: any) => ({ label: `Full Image • ${item?.caption || 'Image'}` }) },
        fields: [
            { type: "image", name: "image", label: "Image", description: "Upload a high quality full width image." },
            { type: "string", name: "caption", label: "Caption", description: "Optional image caption." }
        ]
    },
    {
        name: "textBlock",
        label: "Text Block",
        ui: { itemProps: (item: any) => ({ label: `Text Block • ${item?.heading || 'Text'}` }) },
        fields: [
            { type: "string", name: "heading", label: "Heading", description: "Optional section heading." },
            { type: "rich-text", name: "body", label: "Body", description: "Rich text content." }
        ]
    },
    {
        name: "twoColumn",
        label: "Two Column",
        ui: { itemProps: (item: any) => ({ label: "Two Column (Text + Image)" }) },
        fields: [
            { type: "rich-text", name: "leftContent", label: "Left Content", description: "Text content for the left column." },
            { type: "image", name: "rightImage", label: "Right Image", description: "Image for the right column." }
        ]
    },
    {
        name: "gallery",
        label: "Image Grid",
        ui: { itemProps: (item: any) => ({ label: `Image Grid • ${item?.images?.length || 0} images` }) },
        fields: [
            { type: "image", name: "images", label: "Images", list: true, description: "Upload 2-4 images for the grid." }
        ]
    },
    {
        name: "quote",
        label: "Quote",
        ui: { itemProps: (item: any) => ({ label: `Quote • ${item?.author || 'Quote'}` }) },
        fields: [
            { type: "string", name: "quoteText", label: "Quote Text", ui: { component: "textarea" }, description: "The quote text." },
            { type: "string", name: "author", label: "Author", description: "Person being quoted." }
        ]
    },
    {
        name: "spacer",
        label: "Spacer",
        ui: { itemProps: (item: any) => ({ label: `Spacer • ${item?.size || 'medium'}` }) },
        fields: [
            { type: "string", name: "size", label: "Size", options: ["small", "medium", "large"], description: "Vertical spacing size." }
        ]
    }
];

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
                        type: "object",
                        name: "hero",
                        label: "Hero Section",
                        fields: [
                            { type: "string", name: "title", label: "Hero Title" },
                            { type: "string", name: "subtitle", label: "Hero Subtitle" },
                            { type: "string", name: "videoUrl", label: "Video URL" }
                        ]
                    },
                    {
                        type: "object",
                        name: "intro",
                        label: "Intro Section",
                        fields: [
                            { type: "string", name: "kicker", label: "Kicker" },
                            { type: "string", name: "title", label: "Title" },
                            {
                                type: "rich-text",
                                name: "body",
                                label: "Body"
                            }
                        ]
                    },
                    {
                        type: "object",
                        name: "selectedProjects",
                        label: "Selected Projects",
                        list: true,
                        ui: {
                            itemProps: (item) => ({ label: item?.project })
                        },
                        fields: [
                            {
                                type: "reference",
                                name: "project",
                                label: "Project",
                                collections: ["projects"]
                            }
                        ]
                    }
                ]
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
                ui: {
                    filename: {
                        readonly: true,
                        slugify: (values: any) => {
                            if (values?.title) {
                                return values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                            }
                            return '';
                        },
                    },
                    beforeSubmit: async ({ values }: { values: any }) => {
                        let newValues = { ...values };
                        if (!newValues.slug && newValues.title) {
                            newValues.slug = newValues.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                        }
                        return newValues;
                    },
                },
                fields: [
                    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
                    {
                        type: "string",
                        name: "slug",
                        label: "Slug",
                        ui: {
                            validate: (val) => {
                                if (val && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)) return "Slug must be lowercase and hyphen-separated.";
                            }
                        }
                    },
                    { type: "string", name: "date", label: "Date String (e.g. Feb 2026)", required: true },
                    { type: "image", name: "coverImage", label: "Cover Image", required: true },
                    { type: "string", name: "excerpt", label: "Excerpt", required: true, ui: { component: "textarea" } },
                    { type: "boolean", name: "published", label: "Published" },
                    { type: "number", name: "order", label: "Sort Order" },
                    {
                        type: "object",
                        name: "blocks",
                        label: "Blocks",
                        description: "Add content blocks below",
                        list: true,
                        ui: {
                            visualSelector: true,
                        },
                        templates: blockTemplates,
                    },
                ],
            },
            {
                name: "projects",
                label: "Projects",
                path: "content/projects",
                format: "md",
                ui: {
                    filename: {
                        readonly: true,
                        slugify: (values: any) => {
                            if (values?.title) {
                                return values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                            }
                            return '';
                        },
                    },
                    beforeSubmit: async ({ values }: { values: any }) => {
                        let newValues = { ...values };
                        if (!newValues.slug && newValues.title) {
                            newValues.slug = newValues.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                        }
                        return newValues;
                    },
                },
                fields: [
                    { type: "string", name: "title", label: "Title", isTitle: true, required: true },
                    {
                        type: "string",
                        name: "slug",
                        label: "Slug",
                        ui: {
                            validate: (val) => {
                                if (val && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val)) return "Slug must be lowercase and hyphen-separated.";
                            }
                        }
                    },
                    { type: "string", name: "client", label: "Client", required: true },
                    { type: "string", name: "industry", label: "Industry", required: true },
                    {
                        type: "number",
                        name: "year",
                        label: "Year",
                        required: true,
                        ui: {
                            validate: (val) => {
                                if (val === undefined || val === null) return "Year is required";
                                if (typeof val !== "number") return "Year must be numeric";
                            }
                        }
                    },
                    {
                        type: "string",
                        name: "services",
                        label: "Services",
                        list: true,
                        required: true,
                        ui: {
                            validate: (val) => {
                                if (!val || val.length === 0) return "Services cannot be empty";
                            }
                        }
                    },
                    { type: "string", name: "excerpt", label: "Excerpt", required: true, ui: { component: "textarea" } },
                    { type: "image", name: "heroImage", label: "Hero Image", required: true },
                    { type: "boolean", name: "published", label: "Published" },
                    { type: "number", name: "order", label: "Order" },
                    {
                        type: "object",
                        name: "blocks",
                        label: "Blocks",
                        description: "Add content blocks below",
                        list: true,
                        ui: {
                            visualSelector: true,
                        },
                        templates: blockTemplates,
                    },
                ]
            }
        ],
    },
})
