"use client";

import Loader from "@/components/ui/Loader";
import { useGlobalContext } from "@/context/GlobalContext";

const ClientWrapper = ({ children }) => {
    const { userLoading } = useGlobalContext();

    if (userLoading) {
        return <Loader />;
    }

    return <>{children}</>;
};

export default ClientWrapper;
