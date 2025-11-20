"use client";

import TwibbleLoader from "@/components/TwibbleLoader";
import { useUserContext } from "@/context/UserContext";

export default function ClientWrapper({ children }) {
    const { loading } = useUserContext();

    if (loading) return <TwibbleLoader />;

    return <>{children}</>;
}
