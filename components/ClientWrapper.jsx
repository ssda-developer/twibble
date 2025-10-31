"use client";

import TwibbleLoader from "@/components/TwibbleLoader";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";

export default function ClientWrapper({ children }) {
    const [currentUser, setCurrentUser] = useState(false);
    const { addCurrentUser } = useUserContext();

    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch("http://localhost:3000/api/users");
            const data = await res.json();

            const users = Array.isArray(data.users) ? [...data.users] : [];
            const randomIndex = Math.floor(Math.random() * users.length);

            const randomUser = users[randomIndex];
            setCurrentUser(randomUser);
            addCurrentUser(randomUser);
        }

        fetchUsers();
    }, []);

    if (!currentUser) return <TwibbleLoader />;

    return <>{children}</>;
}
