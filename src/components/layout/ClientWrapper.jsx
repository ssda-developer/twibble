"use client";

import Loader from "@/components/ui/Loader";
import { useGlobalContext } from "@/context/GlobalContext";

const ClientWrapper = ({ children }) => {
    const { loading, userFetchStatus } = useGlobalContext();

    if (loading || userFetchStatus === "idle") {
        return <Loader />;
    }

    return <>{children}</>;
};

export default ClientWrapper;
