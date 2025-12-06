"use client";

import { useLogoutUser, useMeQuery } from "@/features/hooks";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export const GlobalContext = createContext({
    currentUser: null,
    setCurrentUser: () => {
    },
    logout: () => {
    },
    triggerAuthAttention: () => {
    },
    loading: true
});

export const GlobalProvider = ({ children }) => {
    useNavigationHistory();

    const [currentUser, setCurrentUser] = useState(null);

    const { data, isLoading } = useMeQuery();
    const { mutateAsync: logoutMutation } = useLogoutUser();

    const router = useRouter();
    const pathname = usePathname();

    const [routeLoading, setRouteLoading] = useState(false);
    const prevPath = useRef(pathname);

    const [authAttentionHandler, setAuthAttentionHandler] = useState(() => () => {
    });

    useEffect(() => {
        if (!isLoading) {
            setCurrentUser(data?.user || null);
        }
    }, [isLoading, data?.user]);

    useEffect(() => {
        if (prevPath.current !== pathname) {
            setRouteLoading(true);

            const timeout = setTimeout(() => {
                setRouteLoading(false);
            }, 350);

            prevPath.current = pathname;

            return () => clearTimeout(timeout);
        }
    }, [pathname]);

    const logout = async () => {
        router.replace("/");
        setRouteLoading(true);

        try {
            await logoutMutation();
        } catch (e) {
            console.error(e);
        } finally {
            setCurrentUser(null);
            setRouteLoading(false);
        }
    };

    const triggerAuthAttention = useCallback(() => {
        if (typeof window !== "undefined") {
            const width = window.innerWidth;
            const isMobileOrTablet = width < 1024;

            if (isMobileOrTablet) {
                router.push("/authorization");
            }
        }

        authAttentionHandler();
    }, [authAttentionHandler, router]);

    return (
        <GlobalContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                logout,
                triggerAuthAttention,
                setAuthAttentionHandler,
                loading: isLoading || routeLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
