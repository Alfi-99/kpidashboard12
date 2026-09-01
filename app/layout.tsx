import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
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
    <html lang="id" data-theme="light" className={`${poppins.variable} antialiased`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-poppins), 'Poppins', system-ui, sans-serif", minHeight: "100dvh" }}>
        {children}
      </body>
    </html>
  );
}
