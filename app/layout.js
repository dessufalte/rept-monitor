// app/layout.js

import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import Navbar from "./_components/Navbar"; // Make sure to import Navbar

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Reptile Monitoring System",
  description: "Aplikasi Monitoring Reptil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-sans`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}