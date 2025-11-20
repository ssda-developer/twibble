"use client";

import { useUserContext } from "@/context/UserContext";

const Protected = ({ children, mode = "auth" }) => {
    const { currentUser } = useUserContext();

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
