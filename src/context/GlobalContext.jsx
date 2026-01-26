"use client";

import { useLogoutUser, useMeQuery } from "@/features/hooks";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export const GlobalContext = createContext({
    currentUser: null,
    logout: () => {
    },
    triggerAuthAttention: () => {
    },
    setAuthAttentionHandler: () => {
    },
    userLoading: true,
    routeLoading: false
});

export const GlobalProvider = ({ children }) => {
    useNavigationHistory();

    const { data, isLoading: isUserLoading } = useMeQuery();
    const { mutateAsync: logoutMutation } = useLogoutUser();

    const router = useRouter();
    const pathname = usePathname();

    const [routeLoading, setRouteLoading] = useState(false);
    const prevPath = useRef(pathname);

    const currentUser = data?.user || null;

    const [authAttentionHandler, setAuthAttentionHandler] = useState(() => () => {
    });

    useEffect(() => {
        if (prevPath.current !== pathname) {
            setRouteLoading(true);
            const timeout = setTimeout(() => setRouteLoading(false), 500);
            prevPath.current = pathname;
            return () => clearTimeout(timeout);
        }
    }, [pathname]);

    const logout = async () => {
        setRouteLoading(true);
        try {
            await logoutMutation();
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            setRouteLoading(false);
        }
    };

    const triggerAuthAttention = useCallback(() => {
        if (typeof window !== "undefined") {
            if (window.innerWidth < 1024) {
                router.push("/authorization");
            }
        }
        authAttentionHandler();
    }, [authAttentionHandler, router]);

    return (
        <GlobalContext.Provider
            value={{
                currentUser,
                logout,
                triggerAuthAttention,
                setAuthAttentionHandler,
                userLoading: isUserLoading,
                routeLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
