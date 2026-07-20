import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
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
    <html lang="id" data-theme="light" className={`${plusJakartaSans.variable} ${outfit.variable} antialiased`} suppressHydrationWarning>
      <body className="font-body min-h-dvh">
        {children}
      </body>
    </html>
  );
}
