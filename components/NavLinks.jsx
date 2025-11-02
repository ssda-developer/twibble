"use client";

import IconButton from "@/components/IconButton";
import { useUserContext } from "@/context/UserContext";

const NavLinks = () => {
    const { currentUser } = useUserContext();

    const LIST_LINKS = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Explore", href: "/explore", icon: "magnifying-glass" },
        { label: "Notifications", href: "/notifications", icon: "bell" },
        { label: "Messages", href: "/messages", icon: "envelope" },
        { label: "Profile", href: `/${currentUser?.username}/posts`, icon: "user" }
    ];

    return (
        <nav className="flex justify-between lg:flex-col lg:justify-start">
            {LIST_LINKS.map((link, index) => (
                <IconButton key={index} label={link.label} href={link.href} icon={link.icon} />
            ))}
        </nav>
    );
};

export default NavLinks;
