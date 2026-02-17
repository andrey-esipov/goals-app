import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Goals",
  description: "Track your goals, build momentum, see progress.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-dvh font-sans antialiased",
          inter.variable,
        )}
      >
        <Providers>
          <div className="relative flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">
              <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
