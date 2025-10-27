"use client";

import Avatar from "@/components/Avatar";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";

const ProfileBlock = () => {
    const { currentUser } = useUserContext();

    return (
        <div>
            <div className="flex border-b border-slate-800 justify-between p-6">
                <div className="flex flex-col text-gray-400 ml-1">
                    <h2 className="font-bold text-white text-2xl">{currentUser.displayName}</h2>
                    <span className="mb-4">@{currentUser.username}</span>
                    <span className="text-sm">Joined October 2025</span>
                </div>
                <Avatar letter={currentUser.avatarInitials} size="big" />
            </div>
            <div>
                <div className="border-b border-slate-800 py-2 px-6">
                    <Link href="#">2 Following</Link>
                    <Link href="#">0 Followers</Link>
                </div>
                <div className="flex justify-between border-b border-slate-800 py-2 px-6">
                    <Link className="w-full text-center" href={`/${currentUser.username}/posts`}>Posts</Link>
                    <Link className="w-full text-center" href={`/${currentUser.username}/replies`}>Replies</Link>
                    <Link className="w-full text-center" href={`/${currentUser.username}/saved`}>Saved</Link>
                    <Link className="w-full text-center" href={`/${currentUser.username}/likes`}>Likes</Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileBlock;
