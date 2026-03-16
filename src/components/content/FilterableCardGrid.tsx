import { useState, useMemo } from "react";

interface CardEntry {
  title: string;
  description: string;
  href: string;
  domains: string[];
  date: string;
  type: "brief" | "essay";
  readingTime: number;
}

interface DomainInfo {
  id: string;
  label: string;
  colorDark: string;
  colorLight: string;
  count: number;
}

interface Props {
  entries: CardEntry[];
  domains: DomainInfo[];
}

function getThemeMode(): "dark" | "light" {
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "light" ? "light" : "dark";
}

function getDomainColor(domain: DomainInfo): string {
  const mode = getThemeMode();
  return mode === "light" ? domain.colorLight : domain.colorDark;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function FilterableCardGrid({ entries, domains }: Props) {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const domainMap = useMemo(
    () => new Map(domains.map((d) => [d.id, d])),
    [domains]
  );

  const filtered = useMemo(
    () =>
      activeDomain
        ? entries.filter((e) => e.domains.includes(activeDomain))
        : entries,
    [entries, activeDomain]
  );

  return (
    <div>
      {/* Domain filter buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => setActiveDomain(null)}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            fontWeight: 400,
            lineHeight: 1.4,
            padding: "0.3em 0.75em",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--text-ghost)",
            background:
              activeDomain === null ? "var(--text-secondary)" : "transparent",
            color:
              activeDomain === null ? "var(--bg-void)" : "var(--text-secondary)",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          All
        </button>
        {domains.map((d) => (
          <button
            key={d.id}
            onClick={() =>
              setActiveDomain(activeDomain === d.id ? null : d.id)
            }
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              fontWeight: 400,
              lineHeight: 1.4,
              padding: "0.3em 0.75em",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: getDomainColor(d),
              opacity:
                activeDomain === null || activeDomain === d.id ? 0.85 : 0.35,
              color: "var(--bg-void)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "opacity 0.15s",
            }}
          >
            {d.label} ({d.count})
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="content-grid">
        {filtered.map((entry) => (
          <article
            key={entry.href}
            className="content-card"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--text-ghost)",
              borderRadius: "8px",
              overflow: "hidden",
              transition: "transform 0.2s, border-color 0.2s",
            }}
          >
            {/* Intersection bar */}
            <div
              style={{
                height: "3px",
                borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                background:
                  entry.domains.length === 1
                    ? `var(--domain-${entry.domains[0]}, var(--text-ghost))`
                    : `linear-gradient(90deg, ${entry.domains
                        .map((did) => `var(--domain-${did}, var(--text-ghost))`)
                        .join(", ")})`,
              }}
              aria-hidden="true"
            />
            <a
              href={entry.href}
              className="no-underline hover:no-underline"
              style={{ display: "block", padding: "1.25rem", textDecoration: "none" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  lineHeight: 1.4,
                }}
              >
                {entry.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  marginBottom: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {entry.description}
              </p>

              {/* Domain tags */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
                {entry.domains.map((did) => {
                  const d = domainMap.get(did);
                  return (
                    <span
                      key={did}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 400,
                        lineHeight: 1.4,
                        padding: "0.2em 0.6em",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: `var(--domain-${did}, var(--text-ghost))`,
                        color: "var(--bg-void)",
                        whiteSpace: "nowrap",
                        opacity: 0.85,
                      }}
                    >
                      {d?.label ?? did}
                    </span>
                  );
                })}
              </div>

              {/* Metadata */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  color: "var(--text-muted)",
                }}
              >
                <span>{entry.type}</span>
                {entry.readingTime > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{entry.readingTime} min</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <time dateTime={new Date(entry.date).toISOString()}>
                  {formatDate(entry.date)}
                </time>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
