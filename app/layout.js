import Providers from "@/components/Providers";
import { SITE_NAME } from "@/constants";
import { Barlow } from "next/font/google";
import "@/styles/globals.css";

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
            {children}
        </Providers>
        </body>
        </html>
    );
}
