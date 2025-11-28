"use client";

import { useLogoutUser, useMeQuery } from "@/features/hooks";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => {
    },
    logout: () => {
    },
    triggerAuthAttention: () => {
    },
    authAttentionId: 0,
    loading: true
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authAttentionId, setAuthAttentionId] = useState(0);
    const { data, isLoading } = useMeQuery();
    const { mutateAsync: logoutMutation } = useLogoutUser();

    const [userLoaded, setUserLoaded] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setCurrentUser(data?.user || null);
            setUserLoaded(true);
        }
    }, [isLoading, data?.user]);

    const logout = async () => {
        try {
            await logoutMutation();
        } catch (e) {
            console.error(e);
        } finally {
            setCurrentUser(null);
        }
    };

    const triggerAuthAttention = useCallback(() => {
        setAuthAttentionId((prev) => prev + 1);
    }, []);

    return (
        <UserContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                logout,
                loading: !userLoaded,
                triggerAuthAttention,
                authAttentionId
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
