"use client";

import { useUserByNameOrId } from "@/app/features/hooks";
import Avatar from "@/components/Avatar";
import { formatDate } from "@/utils";
import Link from "next/link";

const ProfileBlock = ({ userName }) => {
    const { data } = useUserByNameOrId(userName);

    return (
        <div>
            <div className="flex border-b border-slate-800 justify-between p-6">
                <div className="flex flex-col text-gray-400 ml-1">
                    <h2 className="font-bold text-white text-2xl">{data.displayName}</h2>
                    <span className="mb-4">@{data.username}</span>
                    <span className="text-sm">Joined {formatDate(data.createdAt)}</span>
                </div>
                <Avatar colors={data?.avatar.colors} letter={data.avatar.initials} size="big" />
            </div>
            <div>
                <div className="flex justify-between border-b border-slate-800 py-2 px-6">
                    <Link className="w-full text-center" href={`/${data.username}/posts`}>Posted</Link>
                    <Link className="w-full text-center" href={`/${data.username}/replies`}>Replied</Link>
                    <Link className="w-full text-center" href={`/${data.username}/saved`}>Saved</Link>
                    <Link className="w-full text-center" href={`/${data.username}/likes`}>Liked</Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileBlock;
