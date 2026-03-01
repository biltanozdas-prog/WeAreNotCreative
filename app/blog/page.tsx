import { BlogClient } from "./blog-client"
import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export const metadata: Metadata = {
    title: "Journal | WEARENOTCREATIVE",
    description: "Writing on design, process, culture and the thinking behind our practice."
}

export default async function BlogPage() {
    const blogDir = path.join(process.cwd(), "content", "blog")
    let blogPosts: any[] = []
    try {
        const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))
        blogPosts = files.map(filename => {
            const fileContent = fs.readFileSync(path.join(blogDir, filename), "utf8")
            const { data, content } = matter(fileContent)
            // Reconstruct content array as original layout expected
            const contentArray = content.split('\n\n').filter((p: string) => p.trim() !== '')
            return { ...data, content: contentArray, slug: filename.replace(".md", ""), id: filename }
        })
            .filter((p: any) => p.published === true)
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    } catch (e) { }

    return <BlogClient blogPosts={blogPosts} />
}
