"use client";

import Protected from "@/components/auth/Protected";
import NavLink from "@/components/ui/NavLink";
import { useGlobalContext } from "@/context/GlobalContext";
import Link from "next/link";

const NavLinks = () => {
    const { currentUser } = useGlobalContext();

    const LIST_LINKS = [
        { label: "Home", href: "/", icon: "home", mode: "auth" },
        { label: "Explore", href: "/explore", icon: "magnifying-glass", mode: "auth" },
        { label: "Notifications", href: "/notifications", icon: "bell", mode: "auth" },
        { label: "Messages", href: "/messages", icon: "envelope", mode: "auth" },
        { label: "List", href: "/list", icon: "list-bullet", mode: "auth" },
        { label: "Profile", href: `/${currentUser?.username}/posted`, icon: "user", mode: "auth" }
    ];

    return (
        <nav className="flex justify-between lg:flex-col lg:justify-start">
            {LIST_LINKS.map((link, index) => (
                <Protected mode={link.mode} key={index}>
                    <NavLink label={link.label} href={link.href} icon={link.icon} />
                </Protected>
            ))}
            <Protected mode="guest">
                <div className="p-2 flex justify-center items-center w-full lg:hidden">
                    <Link href="/authorization">
                        Access more features — <span className="underline">sign in</span>.
                    </Link>
                </div>
            </Protected>
        </nav>
    );
};

export default NavLinks;
