import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const disciplines = [
  'Brand Strategy',
  'Visual Systems',
  'Creative Direction',
  'Brand Architecture',
  'Digital Experiences',
  'Objects & Products',
  'Content & Campaign Systems',
]

async function seed() {
  for (let i = 0; i < disciplines.length; i++) {
    await client.createOrReplace({
      _id: `discipline-${i + 1}`,
      _type: 'discipline',
      title: disciplines[i],
      order: i + 1,
    })
    console.log(`Created: ${disciplines[i]}`)
  }
  console.log('Done.')
}

seed().catch(console.error)
