import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";

import { auth } from "@/auth";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MacFAST - Choose a course to study",
  description: "MacFAST online course platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      <Providers session={session}>
        <body
          className={`${inter.variable} ${poppins.variable} antialiased h-full`}
        >
          {children}
        </body>
      </Providers>
    </html>
  );
}
