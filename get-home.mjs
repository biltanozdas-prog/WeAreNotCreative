import { createClient } from "@sanity/client"

const client = createClient({
  projectId: "4qdgb5lz",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false
})

async function run() {
  const data = await client.fetch(`*[_type == "homepage"][0]`)
  console.log(JSON.stringify(data, null, 2))
}

run()
