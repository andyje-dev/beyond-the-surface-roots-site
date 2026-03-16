import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";

interface ContentNode {
  id: string;
  title: string;
  type: "brief" | "essay";
  domains: string[];
  href: string;
}

interface DomainInfo {
  id: string;
  label: string;
  colorDark: string;
  colorLight: string;
  description: string;
  count: number;
}

interface ContentLink {
  source: string;
  target: string;
}

interface Props {
  nodes: ContentNode[];
  links: ContentLink[];
  domains: DomainInfo[];
}

type SimNode = ContentNode & d3.SimulationNodeDatum;
type SimLink = ContentLink & {
  source: SimNode | string;
  target: SimNode | string;
};

function getThemeMode(): "dark" | "light" {
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "light" ? "light" : "dark";
}

export default function NetworkGraph({ nodes, links, domains }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<ContentNode | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const domainColorMap = useMemo(
    () => new Map(domains.map((d) => [d.id, { dark: d.colorDark, light: d.colorLight }])),
    [domains]
  );

  // Filter nodes and links based on active domain
  const { filteredNodes, filteredLinks } = useMemo(() => {
    if (!activeDomain) return { filteredNodes: nodes, filteredLinks: links };

    const filtered = nodes.filter((n) => n.domains.includes(activeDomain));
    const filteredIds = new Set(filtered.map((n) => n.id));
    const fLinks = links.filter(
      (l) => filteredIds.has(l.source) && filteredIds.has(l.target)
    );
    return { filteredNodes: filtered, filteredLinks: fLinks };
  }, [nodes, links, activeDomain]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDimensions({ width, height: Math.max(500, Math.min(width * 0.6, 700)) });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || dimensions.width === 0) return;

    const { width, height } = dimensions;

    function getNodeColor(node: ContentNode): string {
      const mode = getThemeMode();
      const primaryDomain = node.domains[0];
      const colors = domainColorMap.get(primaryDomain);
      return colors ? colors[mode] : mode === "dark" ? "#888" : "#666";
    }

    function getDomainColorByMode(domainId: string, mode: "dark" | "light"): string {
      const colors = domainColorMap.get(domainId);
      return colors ? colors[mode] : mode === "dark" ? "#888" : "#666";
    }

    // Clear previous
    d3.select(svg).selectAll("*").remove();

    const root = d3.select(svg);
    const defs = root.append("defs");
    const g = root.append("g");

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    root.call(zoom);

    // Build simulation
    const simNodes: SimNode[] = filteredNodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = filteredLinks.map((l) => ({ ...l }));

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(40));

    // Links
    const link = g
      .append("g")
      .selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "var(--text-ghost)")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.5);

    // Node groups
    const node = g
      .append("g")
      .selectAll<SVGGElement, SimNode>("g")
      .data(simNodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Gradient stop percentages by domain count:
    // 2: [60%, 40%]  3: [40%, 40%, 20%]  4+: [25%, 25%, 25%, 25%]
    function getGradientStops(count: number): number[] {
      if (count === 2) return [0.6, 0.4];
      if (count === 3) return [0.4, 0.4, 0.2];
      return [0.25, 0.25, 0.25, 0.25];
    }

    // Create gradient defs for multi-domain nodes
    const mode = getThemeMode();
    simNodes.forEach((d) => {
      if (d.domains.length < 2) return;
      const grad = defs
        .append("radialGradient")
        .attr("id", `grad-${d.id}`)
        .attr("cx", "30%")
        .attr("cy", "30%")
        .attr("r", "80%");

      // Cap at 4 domains for gradient display
      const gradDomains = d.domains.slice(0, 4);
      const domainColors = gradDomains.map((did) => getDomainColorByMode(did, mode));
      const stops = getGradientStops(gradDomains.length);

      let offset = 0;
      domainColors.forEach((color, i) => {
        // Each color band: hard start, then transition at the end
        grad.append("stop").attr("offset", `${offset * 100}%`).attr("stop-color", color);
        offset += stops[i];
        grad.append("stop").attr("offset", `${offset * 100}%`).attr("stop-color", color);
      });
    });

    // Node circles — solid fill for single domain, gradient for multi
    node
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) =>
        d.domains.length > 1
          ? `url(#grad-${d.id})`
          : getNodeColor(d)
      )
      .attr("stroke", "var(--bg-void)")
      .attr("stroke-width", 2);

    // Labels
    node
      .append("text")
      .text((d) => {
        const maxLen = 28;
        return d.title.length > maxLen
          ? d.title.slice(0, maxLen - 1) + "\u2026"
          : d.title;
      })
      .attr("dy", -18)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--text-secondary)")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "10px")
      .style("pointer-events", "none");

    // Hover interactions
    node
      .on("mouseenter", function (_event, d) {
        setHoveredNode(d);

        const connectedIds = new Set<string>();
        connectedIds.add(d.id);
        simLinks.forEach((l) => {
          const sourceId =
            typeof l.source === "object" ? l.source.id : l.source;
          const targetId =
            typeof l.target === "object" ? l.target.id : l.target;
          if (sourceId === d.id) connectedIds.add(targetId);
          if (targetId === d.id) connectedIds.add(sourceId);
        });

        node.style("opacity", (n) => (connectedIds.has(n.id) ? 1 : 0.15));
        link.style("opacity", (l) => {
          const sourceId =
            typeof l.source === "object" ? l.source.id : l.source;
          const targetId =
            typeof l.target === "object" ? l.target.id : l.target;
          return sourceId === d.id || targetId === d.id ? 1 : 0.05;
        });
      })
      .on("mouseleave", function () {
        setHoveredNode(null);
        node.style("opacity", 1);
        link.style("opacity", 0.5);
      })
      .on("click", (_event, d) => {
        window.location.href = d.href;
      });

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x!)
        .attr("y1", (d) => (d.source as SimNode).y!)
        .attr("x2", (d) => (d.target as SimNode).x!)
        .attr("y2", (d) => (d.target as SimNode).y!);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Listen for theme changes to update colors and gradients
    const observer = new MutationObserver(() => {
      const newMode = getThemeMode();

      // Update gradients — each gradient has 2 stops per color band
      simNodes.forEach((d) => {
        if (d.domains.length < 2) return;
        const gradDomains = d.domains.slice(0, 4);
        const domainColors = gradDomains.map((did) => getDomainColorByMode(did, newMode));
        const gradEl = defs.select(`#grad-${d.id}`);
        gradEl.selectAll("stop").each(function (_, i) {
          d3.select(this).attr("stop-color", domainColors[Math.floor(i / 2)]);
        });
      });

      // Update solid fills (gradient fills update automatically via the defs)
      node.selectAll<SVGCircleElement, SimNode>("circle")
        .attr("fill", (d) =>
          d.domains.length > 1
            ? `url(#grad-${d.id})`
            : getNodeColor(d)
        );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      simulation.stop();
      observer.disconnect();
    };
  }, [filteredNodes, filteredLinks, domains, dimensions, domainColorMap]);

  function getDomainColor(domainId: string): string {
    const mode = typeof document !== "undefined" ? getThemeMode() : "dark";
    const colors = domainColorMap.get(domainId);
    return colors ? colors[mode] : "#888";
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Domain filter buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.25rem",
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
            background: activeDomain === null ? "var(--text-secondary)" : "transparent",
            color: activeDomain === null ? "var(--bg-void)" : "var(--text-secondary)",
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
            onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              fontWeight: 400,
              lineHeight: 1.4,
              padding: "0.3em 0.75em",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: getDomainColor(d.id),
              opacity: activeDomain === null || activeDomain === d.id ? 0.85 : 0.35,
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

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--text-ghost)",
        }}
      />
      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            right: "1rem",
            background: "var(--bg-card)",
            border: "1px solid var(--text-ghost)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            fontFamily: "var(--font-serif)",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              color: "var(--text-primary)",
              fontSize: "0.8125rem",
            }}
          >
            {hoveredNode.title}
          </span>
          <span
            style={{
              marginLeft: "0.75rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
            }}
          >
            {hoveredNode.type} · {hoveredNode.domains.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
