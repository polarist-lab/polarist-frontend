import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Locale, isValidLocale, localeConfig } from "@/lib/i18n/config";
import { getLocaleMeta } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'jp' }, 
    { locale: 'id' },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {
      title: "Page Not Found",
    };
  }

  const meta = getLocaleMeta(locale);
  const config = localeConfig[locale];

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    other: {
      "content-language": locale,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ja': '/jp', 
        'id': '/id',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  // 유효하지 않은 로케일인 경우 404
  if (!isValidLocale(locale)) {
    notFound();
  }

  const config = localeConfig[locale];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-200">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}