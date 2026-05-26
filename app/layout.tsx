import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "All Marketing — One URL. Complete Campaign.",
    template: "%s | All Marketing",
  },
  description:
    "Paste any URL and get a complete marketing campaign — reels, ads, copy, email sequences, and more. Powered by AI.",
  keywords: [
    "AI marketing campaign",
    "marketing automation",
    "AI reels generator",
    "ad copy generator",
    "email sequence AI",
    "content generation",
    "All Marketing",
  ],
  openGraph: {
    title: "All Marketing — One URL. Complete Campaign.",
    description:
      "Paste any URL and get a complete marketing campaign — reels, ads, copy, email sequences, and more.",
    siteName: "All Marketing",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "All Marketing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Marketing — One URL. Complete Campaign.",
    description: "One URL. Complete campaign. Powered by AI.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
