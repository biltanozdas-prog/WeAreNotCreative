export interface Project {
  id: string
  slug: string
  title: string
  client: string
  year: string
  role: string
  category: string
  image: string
  description: string
  roles: string[]
  services: string[]
  // Case study structure
  overview: string
  context: string
  approach: string
  system: string
  execution: string
  outcome: string
}

export const projects: Project[] = [
  {
    id: "01",
    slug: "gio-telli",
    title: "GIO-TELLI",
    client: "GIO-TELLI",
    year: "2026",
    role: "ART DIRECTION",
    category: "FASHION",
    image: "/images/project-01.jpg",
    description: "A complete visual identity and campaign direction for an emerging fashion label rooted in Mediterranean heritage and contemporary silhouette.",
    roles: ["CREATIVE DIRECTION", "VISUAL SYSTEM", "ART DIRECTION"],
    services: ["Brand Positioning", "Art Direction", "Visual Systems"],
    overview: "GIO-TELLI approached us to build a brand identity that could hold the tension between their Mediterranean heritage and forward-looking design sensibility.",
    context: "The fashion landscape is saturated with brands claiming authenticity. GIO-TELLI needed a visual system that didn't just reference heritage but embodied it — structurally, tonally, materially.",
    approach: "We began with extensive research into Mediterranean visual culture — architecture, textiles, typography, light. The identity was built as a system of relationships rather than a set of assets.",
    system: "A flexible grid system, typographic hierarchy, color logic rooted in stone and sea. Every element was designed to work independently and as part of the whole.",
    execution: "Campaign photography, lookbook art direction, packaging, environmental graphics. Each touchpoint reinforced the same visual logic.",
    outcome: "A brand identity that operates across 12 touchpoints with complete coherence. The system has scaled from editorial to retail without losing its voice.",
  },
  {
    id: "02",
    slug: "concrete-objects",
    title: "CONCRETE\nOBJECTS",
    client: "CONCRETE STUDIO",
    year: "2025",
    role: "OBJECTS",
    category: "PRODUCT DESIGN",
    image: "/images/project-02.jpg",
    description: "A product design collection exploring the relationship between material honesty, functional form and the spaces objects inhabit.",
    roles: ["PRODUCT DESIGN", "VISUAL IDENTITY", "ART DIRECTION"],
    services: ["Product Thinking", "Visual Systems", "Brand Positioning"],
    overview: "Concrete Studio commissioned a collection of objects that would embody their philosophy: material honesty, functional beauty, deliberate restraint.",
    context: "The contemporary design object market oscillates between decorative excess and cold minimalism. We sought a position that felt warm, intentional and structurally honest.",
    approach: "Each object started as a question about use — how it sits, how it's held, how it ages. Material and form were inseparable from the start.",
    system: "A shared material palette (concrete, brass, linen) and formal language (soft geometry, weighted proportions) unified the collection without uniformity.",
    execution: "Prototyping, material testing, production coordination. Photography and packaging followed the same restrained logic.",
    outcome: "A 9-piece collection that sold through its first run in 3 weeks. The design language has since extended into Concrete Studio's broader identity.",
  },
  {
    id: "03",
    slug: "type-manifest",
    title: "TYPE\nMANIFEST",
    client: "ISTANBUL TYPE FOUNDRY",
    year: "2025",
    role: "EDITORIAL",
    category: "TYPOGRAPHY",
    image: "/images/project-03.jpg",
    description: "An editorial and exhibition identity for a typography event celebrating the structural power of letterforms in contemporary design.",
    roles: ["EDITORIAL DIRECTION", "TYPOGRAPHY", "VISUAL SYSTEM"],
    services: ["Art Direction", "Visual Systems", "Identity Architecture"],
    overview: "Istanbul Type Foundry needed an identity for their annual type event that could communicate the seriousness and energy of typographic practice.",
    context: "Type events often default to playful experimentation. ITF wanted something more rigorous — an identity that treated typography as architecture, not decoration.",
    approach: "We approached each spread and surface as a structural exercise. Hierarchy was not decorative but load-bearing. White space was air between buildings.",
    system: "A single typeface in three weights. Black and white only. Scale and placement as the only variables. Constraint as creative engine.",
    execution: "Publication design, environmental signage, digital presence, exhibition materials. Every output followed the same structural rules.",
    outcome: "The event attracted 40% more attendees than the previous year. The identity was featured in 3 international design publications.",
  },
  {
    id: "04",
    slug: "noir-identity",
    title: "NOIR\nIDENTITY",
    client: "NOIR FASHION HOUSE",
    year: "2026",
    role: "BRANDING",
    category: "IDENTITY",
    image: "/images/project-04.jpg",
    description: "A complete brand identity system for a luxury fashion house, built around the tension between heritage craftsmanship and contemporary expression.",
    roles: ["BRAND IDENTITY", "CREATIVE DIRECTION", "PACKAGING"],
    services: ["Brand Positioning", "Identity Architecture", "Visual Systems"],
    overview: "NOIR needed a brand identity that could hold the weight of luxury without relying on its visual cliches.",
    context: "Luxury branding in Istanbul exists in a unique space — between European heritage codes and a local design culture that is raw, young and culturally specific. We needed to honor both.",
    approach: "We started with the question: what does luxury mean when stripped of gold, serif type and marble? The answer was restraint, materiality and precision.",
    system: "A monochromatic identity system with tactile material specifications. Debossed type, uncoated paper, structural packaging. Luxury communicated through touch, not surface.",
    execution: "Full identity rollout across stationery, packaging, retail environment, digital presence. Each touchpoint was prototyped and refined before production.",
    outcome: "A brand identity that repositioned NOIR from a local label to an internationally recognized house. Retail foot traffic increased 60% post-launch.",
  },
  {
    id: "05",
    slug: "white-space",
    title: "WHITE\nSPACE",
    client: "GALLERY ISTANBUL",
    year: "2025",
    role: "SPATIAL",
    category: "EXHIBITION",
    image: "/images/project-05.jpg",
    description: "An exhibition design and spatial identity for a contemporary art gallery exploring the relationship between architecture, art and negative space.",
    roles: ["EXHIBITION DESIGN", "CREATIVE DIRECTION", "SPATIAL"],
    services: ["Art Direction", "Product Thinking", "Identity Architecture"],
    overview: "Gallery Istanbul commissioned a spatial identity for their flagship exhibition that would make the architecture itself part of the conversation.",
    context: "White cube galleries are ubiquitous. The challenge was to create a spatial experience where the architecture actively shaped how visitors perceived the art.",
    approach: "We treated the gallery as a sequence of thresholds — each room a different spatial proposition. Lighting, materiality and proportion were the primary design tools.",
    system: "A modular partition system, consistent lighting logic, and wayfinding typography that integrated into the architecture rather than sitting on top of it.",
    execution: "Spatial design, lighting direction, signage, catalogue design, opening night event design. Everything was installed in 10 days.",
    outcome: "The exhibition ran for 8 weeks and attracted 12,000 visitors. The spatial system has been adopted as the gallery's permanent exhibition framework.",
  },
  {
    id: "06",
    slug: "raw-culture",
    title: "RAW\nCULTURE",
    client: "CULTURE MAGAZINE",
    year: "2026",
    role: "CAMPAIGN",
    category: "FASHION",
    image: "/images/project-06.jpg",
    description: "A campaign direction and visual strategy for a fashion-culture magazine bridging streetwear, editorial photography and subcultural documentation.",
    roles: ["CAMPAIGN DIRECTION", "FASHION", "VISUAL CULTURE"],
    services: ["Art Direction", "Brand Positioning", "Visual Systems"],
    overview: "CULTURE Magazine needed a campaign that could communicate their position at the intersection of streetwear, editorial photography and subcultural documentation.",
    context: "The magazine sits between high fashion and street culture. Previous campaigns leaned too heavily in one direction. We needed to find the visual center.",
    approach: "We cast from the street, not from agencies. Locations were real, not styled. The creative direction was about capturing energy, not manufacturing it.",
    system: "A visual language built on contrast — high production meets raw location, precise typography meets candid photography, luxury fabric meets concrete.",
    execution: "Full campaign shoot across 3 Istanbul locations, 8 models, 2 days. Post-production was deliberately minimal. Layout and typography followed the same raw logic.",
    outcome: "The campaign was featured by 5 international fashion platforms. Magazine subscriptions increased 25% in the quarter following launch.",
  },
]
