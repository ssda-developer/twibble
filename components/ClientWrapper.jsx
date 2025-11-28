"use client";

import TwibbleLoader from "@/components/TwibbleLoader";
import { useUserContext } from "@/context/UserContext";

const ClientWrapper = ({ children }) => {
    const { loading } = useUserContext();

    if (loading) return <TwibbleLoader />;

    return <>{children}</>;
};

export default ClientWrapper;
