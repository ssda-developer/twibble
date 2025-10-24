"use client";

import { createContext, useContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    const addCurrentUser = (user) => {
        setCurrentUser(user);
    };

    return (
        <UserContext.Provider value={{ currentUser, addCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
