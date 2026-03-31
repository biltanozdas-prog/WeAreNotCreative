import { createClient } from 'next-sanity';

const client = createClient({
  projectId: '4qdgb5lz',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function main() {
  const projects = await client.fetch('*[_type == "project"]{ _id, title, "slug": slug, published, order }');
  console.log(JSON.stringify(projects, null, 2));
}

main().catch(console.error);
