import { createClient } from "@sanity/client"

const client = createClient({
  projectId: "4qdgb5lz",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function run() {
  const query = `*[_type == "project" && slug == $testSlug][0] {
    _id,
    title,
    slug
  }`
  const res = await client.fetch(query, { testSlug: "Creative Direction" })
  console.log("Direct Query Match:", res)
  
  const res2 = await client.fetch(query, { testSlug: "Creative%20Direction" })
  console.log("Encoded Match:", res2)
}

run().catch(console.error)
