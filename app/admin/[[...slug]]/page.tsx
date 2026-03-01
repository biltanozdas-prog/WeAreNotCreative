import { redirect } from "next/navigation";

// In modern Next.js App Router (TinaCMS 3.x+), the admin UI is statically 
// generated via 'tinacms build' to public/admin/index.html instead of being 
// rendered by TinaEditProvider or TinaAdmin within the Next.js component tree.
// We redirect to the statically built admin SPA to load the UI correctly locally.
export default function AdminPage() {
    redirect("/admin/index.html");
}
