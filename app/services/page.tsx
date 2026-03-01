import fs from "fs"
import path from "path"
import ServicesClient from "./services-client"

export default async function ServicesPage() {
  const servicesPath = path.join(process.cwd(), "content", "services.json")
  let servicesData: any = {}
  try {
    servicesData = JSON.parse(fs.readFileSync(servicesPath, "utf8"))
  } catch (e) { }

  return <ServicesClient servicesData={servicesData} />
}
