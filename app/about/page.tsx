import fs from "fs"
import path from "path"
import AboutClient from "./about-client"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const aboutPath = path.join(process.cwd(), "content", "about.json")
  let aboutData: any = {}
  try {
    aboutData = JSON.parse(fs.readFileSync(aboutPath, "utf8"))
  } catch (e) { }

  const teamPath = path.join(process.cwd(), "content", "team.json")
  let teamData: any = {}
  try {
    teamData = JSON.parse(fs.readFileSync(teamPath, "utf8"))
  } catch (e) { }

  return <AboutClient aboutData={aboutData} teamData={teamData} />
}
