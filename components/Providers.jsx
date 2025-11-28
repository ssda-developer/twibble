"use client";

import ClientWrapper from "@/components/ClientWrapper";
import { UserProvider } from "@/context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const Providers = ({ children }) => {
    const [client] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={client}>
            <UserProvider>
                <ClientWrapper>
                    {children}
                </ClientWrapper>
            </UserProvider>
        </QueryClientProvider>
    );
};

export default Providers;
