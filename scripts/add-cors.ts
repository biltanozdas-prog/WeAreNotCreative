import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN;

if (!projectId || !token) {
    console.error("Missing credentials in .env.local!");
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-05',
    token,
    useCdn: false
});

async function run() {
    try {
        const res = await client.request({
            uri: '/cors',
            method: 'POST',
            body: {
                origin: 'http://localhost:3000',
                credentials: true
            }
        });
        console.log('CORS origin added successfully:', res);
    } catch (err: any) {
        console.error('Failed to add CORS origin:', err.response?.body || err.message);
    }
}

run();
