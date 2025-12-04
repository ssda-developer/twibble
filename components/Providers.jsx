"use client";

import ClientWrapper from "@/components/ClientWrapper";
import { GlobalProvider } from "@/context/GlobalContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const Providers = ({ children }) => {
    const [client] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={client}>
            <GlobalProvider>
                <ClientWrapper>
                    {children}
                </ClientWrapper>
            </GlobalProvider>
        </QueryClientProvider>
    );
};

export default Providers;
