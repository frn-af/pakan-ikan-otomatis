import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistem Pakan Otomatis",
  description: "Sistem Pakan Ikan Otomatis adalah sebuah sistem yang dirancang untuk memberikan pakan ikan secara otomatis. dengan mengatur waktu dan berat pakan yang akan di berikan kepada ikan.Sistem ini menggunakan mikrokontroler ESP32 sebagai otak dari sistem ini.Sistem ini juga dilengkapi dengan fitur- fitur yang memudahkan pengguna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
