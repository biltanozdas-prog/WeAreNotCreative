export interface TeamMember {
  name: string
  title: string
  image: string
  shortBio: string
  fullBio: string
}

/**
 * Team data — add / remove / reorder members here.
 * When migrating to a CMS, replace this array with a fetch call.
 */
export const team: TeamMember[] = [
  {
    name: "TUNC GULSEN",
    title: "Creative Director",
    image: "/images/team-tunc.jpg",
    shortBio:
      "Working at the intersection of fashion, art and contemporary culture. Based in Istanbul, operating internationally.",
    fullBio:
      "Founder and creative director of WEARENOTCREATIVE. My practice moves between editorial direction, creative consultancy and concept-driven production for fashion, lifestyle and design-led brands.\n\nMy work is rooted in local narratives and translated into global visual language. I collaborate with brands, designers, artists and publications to create projects that feel intentional, culturally aware and forward-looking.\n\nI've led editorial shoots, brand campaigns, spatial concepts and cultural projects across fashion, art and lifestyle. Particularly interested in how identity, place and subculture can be transformed into contemporary creative systems.",
  },
  {
    name: "BILTAN OZDAS",
    title: "Product / Visual Designer",
    image: "/images/team-biltan.jpg",
    shortBio:
      "A creative designer working across physical and visual design, developing concepts that connect form, meaning, and experience.",
    fullBio:
      "My practice evolves through experimentation, research, and continuous learning across diverse creative fields. My work sits at the intersection of design, art, and everyday life, where objects are not only used but experienced.\n\nWith a background spanning industrial design, interior architecture, and art direction, I focus on creating meaningful, human-centered products and visual systems. I aim to balance functionality with emotion, concept with reality.\n\nI enjoy projects that involve research, storytelling, and experimentation — ranging from product design and brand identities to experiential and artistic outcomes. My goal is to integrate artistic expression and design methodology into a single evolving practice.",
  },
]
