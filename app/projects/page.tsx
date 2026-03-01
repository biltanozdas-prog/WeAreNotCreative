import { ProjectsClient } from "./projects-client"
import { Metadata } from "next"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export const metadata: Metadata = {
    title: "Projects | WEARENOTCREATIVE",
    description: "A curated selection across disciplines. Each project is shaped by its own context, scale and ambition."
}

export default async function ProjectsPage() {
    const projectsDir = path.join(process.cwd(), "content", "projects")
    let projects: any[] = []
    try {
        const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
        projects = files.map(filename => {
            const fileContent = fs.readFileSync(path.join(projectsDir, filename), "utf8")
            const { data } = matter(fileContent)
            return { ...data, slug: filename.replace(".md", ""), id: filename }
        })
    } catch (e) { }

    return <ProjectsClient projects={projects} />
}
