import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashboard KPI — Key Performance Indicators",
  description:
    "Dashboard KPI untuk monitoring pencapaian Revenue, CX, Operational, dan metrik performa lainnya secara real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: "var(--font-inter)",
          backgroundColor: "var(--color-bg)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
