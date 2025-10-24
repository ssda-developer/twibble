import Aside from "@/components/Aside";
import Header from "@/components/Header";
import { Providers } from "@/context/providers";
import { Barlow } from "next/font/google";
import "./globals.css";

const geistBarlow = Barlow({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-barlow"
});

export const metadata = {
    title: "Twibble",
    description: "It's like a Twitter clone."
};

export default function RootLayout({ children }) {
    return (
        <Providers>
            <html lang="en">
            <body className={`${geistBarlow.variable} antialiased min-h-screen`}>
            <div className="flex max-w-6xl m-auto">
                <Header />
                <main className="flex-1 border-l border-r border-slate-800">
                    {children}
                </main>
                <Aside />
            </div>
            </body>
            </html>
        </Providers>
    );
}
