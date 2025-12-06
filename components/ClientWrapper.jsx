"use client";

import TwibbleLoader from "@/components/TwibbleLoader";
import { useGlobalContext } from "@/context/GlobalContext";

const ClientWrapper = ({ children }) => {
    const { loading, userFetchStatus } = useGlobalContext();

    if (loading || userFetchStatus === "idle") {
        return <TwibbleLoader />;
    }

    return <>{children}</>;
};

export default ClientWrapper;
