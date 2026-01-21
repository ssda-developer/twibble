"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useNavigationHistory() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const history = JSON.parse(
            sessionStorage.getItem("nav-history") || "[]"
        );

        const last = history[history.length - 1];

        if (last !== pathname) {
            history.push(pathname);
            sessionStorage.setItem("nav-history", JSON.stringify(history));
        }
    }, [pathname]);
}
