import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Campus Compass — Find Your Perfect College in India",
    template: "%s | Campus Compass",
  },
  description:
    "India's most comprehensive college discovery platform. Compare colleges, read verified reviews, take the College Match Quiz, and book 1-on-1 sessions with current students and alumni.",
  keywords: [
    "college discovery India",
    "college comparison",
    "college reviews",
    "JEE colleges",
    "NEET colleges",
    "best engineering colleges India",
    "management colleges India",
    "campus compass",
  ],
  authors: [{ name: "Campus Compass Team" }],
  creator: "Campus Compass",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Campus Compass",
    title: "Campus Compass — Find Your Perfect College in India",
    description:
      "India's most comprehensive college discovery platform. Compare, review, and decide with confidence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Compass",
    description: "Find your perfect college in India.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1E3A8A" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  fontFamily: "Inter, sans-serif",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
