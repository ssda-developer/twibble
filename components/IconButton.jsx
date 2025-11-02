"use client";

import Icon from "@/components/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IconButton = ({ icon, label, href = "#", ariaLabel = "" }) => {
    const pathname = usePathname();
    const isActive = href
        ? (href === "/" ? pathname === "/" : pathname.startsWith(href))
        : false;

    const content = (
        <span
            className={`inline-flex items-center text-xl ${isActive ? "font-black" : "font-semibold"} rounded-full py-3 px-4 group-hover/link:bg-gray-700`}
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

export default IconButton;
