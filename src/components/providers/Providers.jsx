"use client";

import ClientWrapper from "@/components/layout/ClientWrapper";
import { GlobalProvider } from "@/context/GlobalContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const Providers = ({ children }) => {
    const [client] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={client}>
            <GlobalProvider>
                <ClientWrapper>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                </ClientWrapper>
            </GlobalProvider>
        </QueryClientProvider>
    );
};

export default Providers;
