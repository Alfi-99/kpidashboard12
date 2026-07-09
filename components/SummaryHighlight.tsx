// components/SummaryHighlight.tsx
"use client";

interface SummaryHighlightProps {
  items: string[];
}

export default function SummaryHighlight({ items }: SummaryHighlightProps) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <h3
        className="font-heading"
        style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "var(--text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "12px",
        }}
      >
        Summary Highlight : <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "10px", fontStyle: "italic" }}>(Freetext)</span>
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              fontSize: "11.5px",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            <span style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "var(--accent-primary)",
              marginTop: "6px",
              flexShrink: 0,
            }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
