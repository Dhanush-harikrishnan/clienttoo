import type { Metadata } from "next";
import { ClerkProvider} from '@clerk/nextjs'
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clientto",
  description: "Done by Dhanush",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
    <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            >
        
        {children}
        <Toaster />
    </ThemeProvider>
        </body>
            
    </html>
    </ClerkProvider>
  );
}
