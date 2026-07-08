// components/SummaryHighlight.tsx
"use client";

interface SummaryHighlightProps {
  items: string[];
}

export default function SummaryHighlight({ items }: SummaryHighlightProps) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <h3 style={{
        fontSize: "13px",
        fontWeight: 700,
        color: "#1A1A1A",
        marginBottom: "12px",
        lineHeight: 1.3,
        margin: "0 0 12px 0",
      }}>
        Summary Highlight : <span style={{ fontWeight: 400, fontStyle: "italic", color: "#9CA3AF" }}>(Freetext)</span>
      </h3>
      <ul style={{
        listStyle: "disc",
        paddingLeft: "18px",
        margin: 0,
      }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              fontSize: "11px",
              color: "#4B5563",
              lineHeight: "1.7",
              padding: "1px 0",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
