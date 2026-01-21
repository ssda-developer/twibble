"use client";

import NavLinks from "@/src/components/layout/NavLinks";
import Logo from "@/src/components/ui/Logo";

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
