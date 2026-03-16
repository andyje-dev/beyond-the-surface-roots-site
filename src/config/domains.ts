export interface Domain {
  id: string;
  label: string;
  color: {
    dark: string;
    light: string;
  };
  description: string;
}

export const domains: Domain[] = [
  {
    id: "quantum",
    label: "Quantum",
    color: { dark: "#F0B060", light: "#9A6820" },
    description: "Quantum algorithms, simulation, optimization, and hardware",
  },
  {
    id: "agriculture",
    label: "Agriculture",
    color: { dark: "#7CCBA0", light: "#2D7A4A" },
    description: "Soil science, mycorrhizal networks, sustainable farming systems",
  },
  {
    id: "climate",
    label: "Climate",
    color: { dark: "#6AADD8", light: "#2A6A90" },
    description: "Climate modeling, atmospheric systems, water cycles",
  },
  {
    id: "design",
    label: "Design",
    color: { dark: "#C490E0", light: "#6A3A90" },
    description: "Visual systems, interaction design, creative process",
  },
  {
    id: "architecture",
    label: "Architecture",
    color: { dark: "#E0A070", light: "#8A5A30" },
    description: "Built environments, urban planning, structural design",
  },
  {
    id: "iot",
    label: "IoT",
    color: { dark: "#60D0D0", light: "#1A7A7A" },
    description: "Connected devices, embedded systems, sensor networks",
  },
  {
    id: "culture",
    label: "Culture",
    color: { dark: "#D4A0D0", light: "#8A4A80" },
    description: "Music, art, food, traditions, and the stories that bind communities",
  },
  {
    id: "human-rights",
    label: "Human rights",
    color: { dark: "#E07070", light: "#9A2E2E" },
    description: "Equity, justice, access, and dignity across systems",
  },
  {
    id: "policy",
    label: "Policy",
    color: { dark: "#E0C060", light: "#8A7A20" },
    description: "Governance, regulation, institutional frameworks",
  },
  {
    id: "education",
    label: "Education",
    color: { dark: "#A0C060", light: "#5A7A20" },
    description: "Learning systems, pedagogy, knowledge access",
  },
];

export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}
