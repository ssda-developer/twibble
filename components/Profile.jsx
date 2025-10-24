"use client";

import Avatar from "@/components/Avatar";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";

const Profile = () => {
    const [user, setUser] = useState([]);
    const { addCurrentUser } = useUserContext();

    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch("http://localhost:3000/api/users");
            const data = await res.json();

            const users = Array.isArray(data) ? [...data] : [];
            const randomIndex = Math.floor(Math.random() * users.length);

            setUser(users[randomIndex]);
            addCurrentUser(users[randomIndex]);
        }

        fetchUsers();
    }, []);


    return (
        <div className="p-4 rounded-xl border border-slate-800 flex">
            <Avatar letter={user.avatarInitials} />
            <div className="flex flex-col ml-2">
                <span>{user.name}</span>
                <span className="text-sm">@{user.username}</span>
            </div>
        </div>
    );
};

export default Profile;
