import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pdf pages",
  description: "Extract specific pages from textbook PDFs and merge multiple PDFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.add('light');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className={`${ebGaramond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
