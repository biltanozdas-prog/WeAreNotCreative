import { createClient } from "@sanity/client"

const client = createClient({
  projectId: "4qdgb5lz",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function run() {
  const query1 = `*[_type == "project"] { _id, title, published }`
  const res1 = await client.fetch(query1)
  console.log("All projects:", res1.map(p => `${p.title}: published=${p.published}`))

  const query2 = `*[_type == "project" && coalesce(published, true) == true] { _id, title }`
  const res2 = await client.fetch(query2)
  console.log("Projects matching coalesce:", res2.map(p => p.title))

  const query3 = `*[_type == "homepage"][0] {
    "selectedProjects": selectedProjects[]->{ _id, title, published }[coalesce(published, true) == true]
  }`
  const res3 = await client.fetch(query3)
  console.log("Homepage selectedProjects Raw:", JSON.stringify(res3?.selectedProjects, null, 2))
}

run().catch(console.error)
