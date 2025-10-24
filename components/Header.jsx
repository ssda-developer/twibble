"use client";

import IconButton from "@/components/IconButton";
import { useUserContext } from "@/context/UserContext";

const Header = () => {
    const { currentUser } = useUserContext();

    const LIST_LINKS = [
        { label: "Home", href: "/", icon: "home" },
        { label: "Explore", href: "/explore", icon: "magnifying-glass" },
        { label: "Notifications", href: "/notifications", icon: "bell" },
        { label: "Messages", href: "/messages", icon: "envelope" },
        { label: "Profile", href: `/${currentUser.username}/posts`, icon: "user" }
    ];

    return (
        <div className="w-65 sticky top-0 h-screen shrink-0">
            <>
                <div className="pt-6 pb-2 px-4">
                    <h1 className="text-3xl font-black">Twibble</h1>
                </div>

                <div>
                    <nav className="flex flex-col">
                        {LIST_LINKS.map((link, index) => (
                            <IconButton key={index} label={link.label} href={link.href} icon={link.icon} />
                        ))}
                    </nav>
                </div>
            </>
        </div>
    );
};

export default Header;
