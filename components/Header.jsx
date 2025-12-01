"use client";

import Logo from "@/components/Logo";
import NavLinks from "@/components/NavLinks";

const Header = () => {
    return (
        <>
            <div className="flex justify-center lg:justify-start p-1.5 lg:pt-6 lg:pb-2 lg:px-4">
                <Logo />
            </div>
            <div className="hidden lg:block">
                <NavLinks />
            </div>
        </>
    );
};

export default Header;
