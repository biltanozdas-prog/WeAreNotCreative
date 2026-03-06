import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@sanity/client';
import { htmlToBlocks } from '@sanity/block-tools';
import { Schema } from '@sanity/schema';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN;

const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    apiVersion: '2024-03-05',
    token: token || 'dummy-token',
});

const defaultSchema = Schema.compile({
    name: 'default',
    types: [
        {
            type: 'object',
            name: 'blockContent',
            fields: [
                {
                    title: 'Block',
                    name: 'block',
                    type: 'array',
                    of: [{ type: 'block' }],
                },
            ],
        },
    ],
});
const blockContentType = defaultSchema.get('blockContent').fields.find((f: any) => f.name === 'block').type;

function generateKey() {
    return Math.random().toString(36).substring(2, 10);
}

function markdownToPortableText(markdownStr: string) {
    if (!markdownStr || typeof markdownStr !== 'string') return [];
    const html = marked.parse(markdownStr) as string;
    const blocks = htmlToBlocks(html, blockContentType, {
        parseHtml: html => new JSDOM(html).window.document,
    });
    return blocks.map((b: any) => ({ ...b, _key: b._key || generateKey() }));
}

async function uploadImageIfLocal(imagePath: string): Promise<any> {
    if (!imagePath || typeof imagePath !== 'string') return undefined;
    if (imagePath.startsWith('http')) return undefined;

    const localPath = path.join(process.cwd(), 'public', imagePath);
    if (!fs.existsSync(localPath)) return undefined;

    try {
        if (token) {
            const asset = await client.assets.upload('image', fs.createReadStream(localPath), {
                filename: path.basename(imagePath)
            });
            return {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                }
            };
        } else {
            return { _type: 'image', asset: { _type: 'reference', _ref: `image-${generateKey()}` } };
        }
    } catch (err) {
        console.error(`Failed to upload ${imagePath}:`, err);
        return undefined;
    }
}

async function processBlocks(blocks: any[]): Promise<any[]> {
    if (!blocks || !Array.isArray(blocks)) return [];

    const processed = [];
    for (const block of blocks) {
        const { _template, ...rest } = block;
        const _key = generateKey();
        const _type = _template;

        switch (_type) {
            case 'heroOverride':
                processed.push({ _key, _type, title: rest.title, image: await uploadImageIfLocal(rest.image) });
                break;
            case 'fullImage':
                processed.push({ _key, _type, caption: rest.caption, image: await uploadImageIfLocal(rest.image) });
                break;
            case 'textBlock':
                processed.push({ _key, _type, heading: rest.heading, body: markdownToPortableText(rest.body) });
                break;
            case 'twoColumn':
                processed.push({ _key, _type, leftContent: markdownToPortableText(rest.leftContent), rightImage: await uploadImageIfLocal(rest.rightImage) });
                break;
            case 'gallery':
                if (Array.isArray(rest.images)) {
                    const uploads = await Promise.all(rest.images.map((img: string) => uploadImageIfLocal(img)));
                    processed.push({ _key, _type, images: uploads.filter(Boolean) });
                } else {
                    processed.push({ _key, _type });
                }
                break;
            case 'quote':
                processed.push({ _key, _type, quoteText: rest.quoteText, author: rest.author });
                break;
            case 'spacer':
                processed.push({ _key, _type, size: rest.size });
                break;
            default:
                processed.push({ _key, _type, ...rest });
        }
    }
    return processed;
}

async function runMigration() {
    const projectsDir = path.join(process.cwd(), 'content', 'projects');
    const blogDir = path.join(process.cwd(), 'content', 'blog');

    console.log("Starting Migration to Sanity...");
    if (!token) {
        console.warn("⚠️ SANITY_API_TOKEN is missing. Running in dry-run mode (no data will be written).");
    }

    // Migrate Projects
    if (fs.existsSync(projectsDir)) {
        const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));
        for (const filename of files) {
            const filepath = path.join(projectsDir, filename);
            const content = fs.readFileSync(filepath, 'utf8');
            const parsed = matter(content);
            const slug = parsed.data.slug || filename.replace('.md', '');

            if (token) {
                const query = `*[_type == "project" && slug == $slug][0]._id`;
                const exists = await client.fetch(query, { slug });
                if (exists) {
                    console.log(`Skipping duplicate project: ${parsed.data.title || slug}`);
                    continue;
                }
            }

            const doc = {
                _type: 'project',
                title: parsed.data.title || 'Untitled',
                slug: slug,
                client: parsed.data.client || '',
                industry: parsed.data.industry || parsed.data.category || '',
                services: parsed.data.services || [],
                excerpt: parsed.data.excerpt || parsed.data.description || '',
                heroImage: await uploadImageIfLocal(parsed.data.heroImage || parsed.data.image),
                published: parsed.data.published !== false,
                order: parsed.data.order || 999,
                blocks: await processBlocks(parsed.data.blocks),
            };

            if (token) {
                await client.create(doc);
            }
            console.log(`Migrated project: ${doc.title || slug}`);
        }
    }

    // Migrate Blog
    if (fs.existsSync(blogDir)) {
        const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
        for (const filename of files) {
            const filepath = path.join(blogDir, filename);
            const content = fs.readFileSync(filepath, 'utf8');
            const parsed = matter(content);
            const slug = parsed.data.slug || filename.replace('.md', '');

            if (token) {
                const query = `*[_type == "blogPost" && slug == $slug][0]._id`;
                const exists = await client.fetch(query, { slug });
                if (exists) {
                    console.log(`Skipping duplicate blog: ${parsed.data.title || slug}`);
                    continue;
                }
            }

            const doc: any = {
                _type: 'blogPost',
                title: parsed.data.title || 'Untitled',
                slug: slug,
                date: parsed.data.date,
                coverImage: await uploadImageIfLocal(parsed.data.coverImage || parsed.data.image),
                excerpt: parsed.data.excerpt || parsed.data.description || '',
                published: parsed.data.published !== false,
                order: parsed.data.order || 999,
                blocks: await processBlocks(parsed.data.blocks),
            };

            if (parsed.content && parsed.content.trim() && (!doc.blocks || doc.blocks.length === 0)) {
                const ptBlocks = markdownToPortableText(parsed.content);
                if (ptBlocks.length > 0) {
                    doc.blocks = [
                        { _key: generateKey(), _type: 'textBlock', body: ptBlocks }
                    ];
                }
            }

            if (token) {
                await client.create(doc);
            }
            console.log(`Migrated blog: ${doc.title || slug}`);
        }
    }

    console.log("Migration Complete.");
}

runMigration().catch(console.error);
