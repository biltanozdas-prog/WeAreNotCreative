export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  readTime: string
  content: string[]
  pullQuote: string
  contentImages: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: "01",
    slug: "design-as-cultural-practice",
    title: "Design as Cultural Practice",
    excerpt:
      "How we approach design not as decoration, but as a way to shape cultural narratives and challenge the boundaries between art, commerce and identity.",
    date: "Feb 2026",
    category: "Perspective",
    image: "/images/blog-01.jpg",
    readTime: "5 min read",
    pullQuote:
      "Design is not what it looks like. Design is how it positions itself within culture.",
    content: [
      "There is a persistent myth that design exists to make things look better. We reject that entirely. Design, when practiced with intention, is a cultural act. It shapes how people perceive brands, spaces, objects and each other.",
      "At WEARENOTCREATIVE, we approach every project as an opportunity to say something meaningful. Not louder, not flashier, but more intentional. The question we ask is never 'how should this look?' but rather 'what should this mean?'",
      "This perspective has led us to work across disciplines that might seem disconnected at first glance — fashion editorial, product design, brand systems, spatial concepts. But the thread that connects them all is a belief that visual culture matters, and that designers have a responsibility to shape it thoughtfully.",
      "When we designed the identity for NOIR Fashion House, we didn't start with colors or typefaces. We started with a conversation about what luxury means in Istanbul today. About the tension between heritage and modernity, restraint and expression. The visual system emerged from that dialogue.",
      "We believe the most powerful design work doesn't announce itself. It creates a feeling, establishes a tone, builds a world. And then it steps back and lets the audience enter.",
    ],
    contentImages: ["/images/blog-01.jpg", "/images/project-04.jpg"],
  },
  {
    id: "02",
    slug: "the-space-between-objects",
    title: "The Space Between Objects",
    excerpt:
      "On spatial awareness in product design and how the gaps between things tell us more than the things themselves.",
    date: "Jan 2026",
    category: "Objects",
    image: "/images/blog-02.jpg",
    readTime: "4 min read",
    pullQuote:
      "The most important part of any composition is the empty space. It's where meaning breathes.",
    content: [
      "In product design, we are often obsessed with the object itself — its form, its material, its function. But what if the real design lives in the space around it?",
      "Japanese design philosophy has long understood the concept of 'ma' — the gap, the pause, the space between. It's not emptiness. It's potential. It's where the relationship between objects happens.",
      "When we worked on CONCRETE OBJECTS, we spent as much time thinking about the shelf as the product. How does it sit? What does it look next to? What happens when you pick it up and put it back down?",
      "These questions led us to a design language that was deliberately restrained. Flat surfaces that invited touch. Weight that communicated permanence. Color that receded so texture could speak.",
      "The lesson we keep relearning is this: good design knows when to stop. The negative space, the silence, the restraint — that's where the sophistication lives.",
    ],
    contentImages: ["/images/blog-02.jpg", "/images/project-02.jpg"],
  },
  {
    id: "03",
    slug: "backstage-is-the-real-show",
    title: "Backstage Is the Real Show",
    excerpt:
      "Why the process of making is more interesting than the final product, and how we document the work behind the work.",
    date: "Dec 2025",
    category: "Process",
    image: "/images/blog-03.jpg",
    readTime: "6 min read",
    pullQuote:
      "The polished result is just the surface. The real story is in the mess, the doubt, the revision.",
    content: [
      "There is a growing hunger for authenticity in creative culture. People don't just want to see the final campaign — they want to see the mood boards, the rejected drafts, the moments of uncertainty.",
      "We've started treating process documentation as a creative discipline in itself. Not as behind-the-scenes content for social media, but as a genuine artistic practice that reveals how ideas evolve.",
      "During the GIO-TELLI shoot, our photographer captured moments between takes — the model adjusting fabric, the stylist stepping back to reassess, the creative director sketching a note on a napkin. These images ended up being more powerful than the final selects.",
      "This isn't about being raw for the sake of it. It's about honesty. The creative process is messy, non-linear, and full of dead ends. Showing that doesn't diminish the work. It humanizes it.",
      "We're now building process archives for every major project. Not as marketing material, but as a record of how creative decisions actually get made. Because that knowledge is valuable, and it deserves to be preserved.",
    ],
    contentImages: ["/images/blog-03.jpg", "/images/project-01.jpg"],
  },
  {
    id: "04",
    slug: "typography-as-architecture",
    title: "Typography as Architecture",
    excerpt:
      "Exploring how letterforms build space, create rhythm and establish the structural foundation of visual communication.",
    date: "Nov 2025",
    category: "Typography",
    image: "/images/blog-04.jpg",
    readTime: "5 min read",
    pullQuote:
      "A typeface is not a font choice. It's an architectural decision that defines the space everything else occupies.",
    content: [
      "We think of typography the way an architect thinks of structure. Before anything else — before color, before imagery, before layout — there is the letter. And the letter defines everything.",
      "When we were developing TYPE MANIFEST for Istanbul Type Foundry, we approached the brief as an architectural project. Each spread was a room. Each headline was a load-bearing wall. The white space was the air between buildings.",
      "This metaphor isn't just poetic — it's practical. When you think of type as structure, you make better decisions about hierarchy, spacing, and rhythm. You stop decorating and start building.",
      "The brutalist approach to typography strips away ornamentation and asks the letter to do the work on its own. No gradients, no effects, no tricks. Just weight, scale, and placement.",
      "In our studio, we have a rule: if the design doesn't work in black and white, in a single typeface, at one size — it doesn't work. Everything else is enhancement. The structure must be sound first.",
    ],
    contentImages: ["/images/blog-04.jpg", "/images/project-03.jpg"],
  },
]
