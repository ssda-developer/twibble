"use client";

import Avatar from "@/components/Avatar";
import { useUserContext } from "@/context/UserContext";

const Profile = () => {
    const { currentUser } = useUserContext();

    return (
        <div className="p-4 rounded-xl border border-slate-800 flex">
            <Avatar letter={currentUser?.avatarInitials} />
            <div className="flex flex-col ml-2">
                <span>{currentUser?.displayName}</span>
                <span className="text-sm">@{currentUser?.username}</span>
            </div>
        </div>
    );
};

export default Profile;
