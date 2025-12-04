"use client";

import TwibbleLoader from "@/components/TwibbleLoader";
import { useGlobalContext } from "@/context/GlobalContext";

const ClientWrapper = ({ children }) => {
    const { loading } = useGlobalContext();

    if (loading) return <TwibbleLoader />;

    return <>{children}</>;
};

export default ClientWrapper;
