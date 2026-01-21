"use client";

import { useGlobalContext } from "@/src/context/GlobalContext";

const Protected = ({ children, mode = "auth" }) => {
    const { currentUser } = useGlobalContext();

    if (mode === "all") {
        return children;
    }

    if (mode === "auth") {
        if (!currentUser) return null;

        return children;
    }

    if (mode === "guest") {
        if (currentUser) return null;

        return children;
    }

    return null;
};

export default Protected;
