import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "Five Borough Commons",
    template: "%s | Five Borough Commons",
  },
  description: "A GitHub-native civic technology project incubator for New York City.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <a
          className="sr-only rounded-sm bg-orange-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
          href="#main-content"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
