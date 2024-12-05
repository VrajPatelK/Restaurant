'use client';
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const routerConfig = extractRouterConfig(ourFileRouter);

  return (
    <html lang="en">
      <body>
        {/* <SessionProvider session={session}> */}
          <Navbar />
          <NextSSRPlugin routerConfig={routerConfig} />
          <div className="flex flex-col min-h-screen">
            {children}
            <Toaster />
          </div>
          <Footer />
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
