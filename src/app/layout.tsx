import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "../styles/globals.css";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
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
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <Providers session={session}>
        <body className={`${inter.variable} ${poppins.variable} antialiased`}>
          {children}
        </body>
      </Providers>
    </html>
  );
}
