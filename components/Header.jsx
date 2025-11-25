"use client";

import NavLinks from "@/components/NavLinks";
import { SITE_NAME } from "@/constants";
import Link from "next/link";

const Header = () => {
    return (
        <>
            <div className="flex justify-center lg:justify-start p-1.5 lg:pt-6 lg:pb-2 lg:px-4">
                <Link href="/" className="inline-block">
                    <h1 className="text-2xl lg:text-4xl font-black">{SITE_NAME}</h1>
                </Link>
            </div>
            <div className="hidden lg:block">
                <NavLinks />
            </div>
        </>
    );
};

export default Header;
