"use client";

import LogoutButton from "@/src/components/auth/LogoutButton";
import Avatar from "@/src/components/ui/Avatar";
import { useGlobalContext } from "@/src/context/GlobalContext";

const Profile = () => {
    const { currentUser } = useGlobalContext();

    if (!currentUser) return null;

    return (
        <div className="p-4 rounded-xl border border-slate-800 flex items-start">
            <Avatar colors={currentUser?.avatar?.colors} letter={currentUser?.avatar?.initials} />
            <div className="flex flex-col ml-2">
                <span>{currentUser?.displayName}</span>
                <span className="text-sm">@{currentUser?.username}</span>
            </div>
            <LogoutButton />
        </div>
    );
};

export default Profile;
