// components/SummaryHighlight.tsx
"use client";

interface SummaryHighlightProps {
  items: string[];
}

export default function SummaryHighlight({ items }: SummaryHighlightProps) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <h3
        style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "#948f89",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "12px",
          fontFamily: "inherit",
        }}
      >
        Summary Highlight : <span style={{ color: "#77726c", fontWeight: 400, fontSize: "10px", fontStyle: "italic" }}>(Freetext)</span>
      </h3>
      {(!items || items.length === 0) ? (
        <p style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.45)", fontStyle: "italic", margin: 0 }}>
          Belum ada catatan highlight untuk periode ini.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((item, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontSize: "11.5px",
                color: "#d9d3cf",
                lineHeight: 1.5,
              }}
            >
              <span style={{
                display: "inline-block",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#ff8ca3",
                marginTop: "6px",
                flexShrink: 0,
              }} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
