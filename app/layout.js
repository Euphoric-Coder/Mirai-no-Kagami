import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mirai no Kagami - Mirror of the Future",
  description:
    "Mirai no Kagami (未来の鏡), meaning “Mirror of the Future”, is an interactive reflective app that visualizes two possible paths of a New Year’s resolution: Genjitsu (現実) — the likely reality where habits fade, and Mirai (未来) — the possible future where consistency leads to success.The app presents both outcomes in a thoughtful, engaging way, encouraging self-awareness, learning, and intentional action rather than judgment.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
