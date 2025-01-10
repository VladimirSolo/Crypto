import type { Metadata } from "next";

import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/providers/providers";
import { MainLayout } from "@/layouts/MainLayout";

export const metadata: Metadata = {
  title: "Cryto",
  description: "Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen container mx-auto">
          <Providers>
            {" "}
            <MainLayout>{children}</MainLayout>
          </Providers>
        </div>
      </body>
    </html>
  );
}
