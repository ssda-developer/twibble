"use client";

import IconButton from "@/components/IconButton";
import Protected from "@/components/Protected";
import { useUserContext } from "@/context/UserContext";

const NavLinks = () => {
    const { currentUser } = useUserContext();

    const LIST_LINKS = [
        { label: "Home", href: "/", icon: "home", mode: "auth" },
        { label: "Explore", href: "/explore", icon: "magnifying-glass", mode: "auth" },
        { label: "Notifications", href: "/notifications", icon: "bell", mode: "auth" },
        { label: "Messages", href: "/messages", icon: "envelope", mode: "auth" },
        { label: "List", href: "/list", icon: "list-bullet", mode: "auth" },
        { label: "Profile", href: `/${currentUser?.username}/posts`, icon: "user", mode: "auth" }
    ];

    return (
        <nav className="flex justify-between lg:flex-col lg:justify-start">
            {LIST_LINKS.map((link, index) => (
                <Protected mode={link.mode} key={index}>
                    <IconButton label={link.label} href={link.href} icon={link.icon} />
                </Protected>
            ))}
        </nav>
    );
};

export default NavLinks;
