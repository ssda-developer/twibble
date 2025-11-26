"use client";

import Avatar from "@/components/Avatar";
import LogoutButton from "@/components/LogoutButton";
import { useUserContext } from "@/context/UserContext";

const Profile = () => {
    const { currentUser } = useUserContext();

    return (
        <div className="p-4 rounded-xl border border-slate-800 flex items-start">
            <Avatar colors={currentUser?.avatar.colors} letter={currentUser?.avatar.initials} />
            <div className="flex flex-col ml-2">
                <span>{currentUser?.displayName}</span>
                <span className="text-sm">@{currentUser?.username}</span>
            </div>
            <LogoutButton />
        </div>
    );
};

export default Profile;
