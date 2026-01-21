"use client";

import { useLogoutUser, useMeQuery } from "@/src/features/hooks";
import { useNavigationHistory } from "@/src/hooks/useNavigationHistory";
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
    setAuthAttentionHandler: () => {
    },
    userFetchStatus: "idle",
    loading: true
});

export const GlobalProvider = ({ children }) => {
    useNavigationHistory();

    const [currentUser, setCurrentUser] = useState(null);
    const [userFetchStatus, setUserFetchStatus] = useState("idle");

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
            setUserFetchStatus(data?.user ? "found" : "not_found");
        }
    }, [isLoading, data?.user]);

    useEffect(() => {
        if (prevPath.current !== pathname) {
            setRouteLoading(true);

            const timeout = setTimeout(() => {
                setRouteLoading(false);
            }, 500);

            prevPath.current = pathname;

            return () => clearTimeout(timeout);
        }
    }, [pathname]);

    const logout = async () => {
        setRouteLoading(true);

        try {
            await logoutMutation();
        } catch (e) {
            console.error(e);
        } finally {
            setCurrentUser(null);
            setUserFetchStatus("user_logout");
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
                setUserFetchStatus,
                logout,
                triggerAuthAttention,
                setAuthAttentionHandler,
                userFetchStatus,
                loading: isLoading || routeLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
