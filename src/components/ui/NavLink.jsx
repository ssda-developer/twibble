"use client";

import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ icon, label, href = "#", ariaLabel = "" }) => {
    const pathname = usePathname();

    const doesMenuMatch = (href, pathname) => {
        if (href === "/" && pathname === "/") {
            return true;
        }

        const hrefParts = href.split("/").filter(Boolean);
        const pathParts = pathname.split("/").filter(Boolean);

        if (hrefParts.length === 1) {
            return pathParts.length === 1 && hrefParts[0] === pathParts[0];
        }

        if (hrefParts.length === 2 && pathParts.length === 2) {
            return hrefParts[0] === pathParts[0];
        }

        return false;
    };

    const isActive = href && pathname
        ? doesMenuMatch(href, pathname)
        : false;

    const content = (
        <span
            className={`inline-flex items-center text-xl ${isActive ? "font-black" : "font-semibold"} rounded-full py-3 px-4 group-hover/link:bg-slate-700`}
        >
            <Icon name={icon} type={`${isActive ? "solid" : "outline"}`} />
            {label && <span className="hidden md:inline ml-2">{label}</span>}
        </span>
    );

    if (href) {
        return (
            <Link
                href={href}
                aria-label={ariaLabel ?? label}
                title={label}
                aria-current={isActive ? "page" : undefined}
                className="inline-block cursor-pointer group/link"
            >
                {content}
            </Link>
        );
    }

    return content;
};

export default NavLink;
