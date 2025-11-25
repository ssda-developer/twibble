import { Providers } from "@/app/providers";
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import NavLinks from "@/components/NavLinks";
import { SITE_NAME } from "@/constants";
import { Barlow } from "next/font/google";
import "./globals.css";

const geistBarlow = Barlow({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-barlow"
});

export const metadata = {
    title: SITE_NAME,
    description: "It's like a Twitter clone."
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${geistBarlow.variable} antialiased min-h-screen`}>
        <Providers>
            <div className="flex flex-col lg:flex-row max-w-6xl m-auto">
                <div className="w-full bg-black/10 backdrop-blur-md lg:w-62 sticky top-0 lg:h-screen lg:shrink-0 z-10">
                    <Header />
                </div>
                <main className="flex-1 border-l border-r border-slate-800">
                    {children}
                </main>
                <div className="w-78 sticky top-0 h-screen shrink-0 p-6 hidden lg:block">
                    <Aside />
                </div>
                <div className="block lg:hidden sticky bottom-0 w-full bg-black/10 backdrop-blur-md z-10">
                    <NavLinks />
                </div>
            </div>
        </Providers>
        </body>
        </html>
    );
}
