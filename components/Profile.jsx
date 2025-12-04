"use client";

import Avatar from "@/components/Avatar";
import LogoutButton from "@/components/LogoutButton";
import { useGlobalContext } from "@/context/GlobalContext";

const Profile = () => {
    const { currentUser } = useGlobalContext();

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
