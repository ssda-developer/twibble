"use client";

import { UserProvider } from "@/context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }) {
    const [client] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={client}>
            <UserProvider>
                {children}
            </UserProvider>
        </QueryClientProvider>
    );
}
