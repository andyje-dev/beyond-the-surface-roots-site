import { domains, type Domain } from "../config/domains";

export function getDomainColor(
  id: string,
  mode: "dark" | "light" = "dark",
): string {
  const domain = domains.find((d) => d.id === id);
  return domain ? domain.color[mode] : mode === "dark" ? "#888" : "#666";
}

export function getDomainLabel(id: string): string {
  const domain = domains.find((d) => d.id === id);
  return domain?.label ?? id;
}

export function getIntersectionGradient(
  domainIds: string[],
  mode: "dark" | "light" = "dark",
): string {
  if (domainIds.length === 0) return "transparent";
  if (domainIds.length === 1) return getDomainColor(domainIds[0], mode);
  const colors = domainIds.map((id) => getDomainColor(id, mode));
  return `linear-gradient(90deg, ${colors.join(", ")})`;
}
