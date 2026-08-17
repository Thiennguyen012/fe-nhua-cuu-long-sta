import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
const font = Be_Vietnam_Pro({ variable: "--font-be-vietnam", subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700", "800"] });
export const metadata: Metadata = { title: "Nhựa Cửu Long STA | Giải pháp nhựa công nghiệp", description: "Sản phẩm nhựa chất lượng cao cho công nghiệp và đời sống." };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="vi" className={`${font.variable} ${font.className}`}><body>{children}</body></html>; }
