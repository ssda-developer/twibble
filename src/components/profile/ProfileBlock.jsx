"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import Protected from "@/components/auth/Protected";
import Avatar from "@/components/ui/Avatar";
import { useGlobalContext } from "@/context/GlobalContext";
import { useUserByNameOrId } from "@/features/hooks";
import { formatDate } from "@/utils";
import Link from "next/link";

const ProfileBlock = ({ userName }) => {
    const { currentUser } = useGlobalContext();
    const { data } = useUserByNameOrId(userName);

    const isOwner = currentUser?._id === data?._id;

    return (
        <>
            <div className="flex border-b border-slate-800 justify-between p-6">
                <div className="flex flex-col text-slate-400 ml-1">
                    <h2 className="font-bold text-white text-2xl">{data?.displayName}</h2>
                    <span className="mb-4">@{data?.username}</span>
                    <span className="text-sm">Joined {formatDate(data?.createdAt)}</span>
                </div>
                <div>
                    <Avatar colors={data?.avatar?.colors} letter={data?.avatar?.initials} size="big" classes="mb-2" />
                    {isOwner &&
                        <Protected>
                            <LogoutButton text="Logout" classes="lg:hidden" />
                        </Protected>
                    }
                </div>
            </div>
            <div>
                <div className="flex justify-between border-b border-slate-800 py-2 px-6">
                    <Link className="w-full text-center" href={`/${data?.username}/posted`}>Posted</Link>
                    <Link className="w-full text-center" href={`/${data?.username}/replied`}>Replied</Link>
                    {isOwner && (
                        <>
                            <Link className="w-full text-center" href={`/${data?.username}/saved`}>Saved</Link>
                            <Link className="w-full text-center" href={`/${data?.username}/liked`}>Liked</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileBlock;
