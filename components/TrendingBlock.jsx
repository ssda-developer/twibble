"use client";

import { useTrendingPosts } from "@/features/hooks";
import { timeAgo } from "@/utils";
import Link from "next/link";

const TrendingBlock = () => {
    const { data, isLoading, isError } = useTrendingPosts();

    if (isLoading) return null;
    if (isError) return null;
    if (!Array.isArray(data?.posts) || data.posts.length === 0) return null;

    return (
        <div className="flex flex-col pt-4 px-4 pb-6 rounded-xl border border-slate-800">
            <h3 className="font-black mb-4 text-xl">Most liked in 24 hours</h3>
            <ul className="flex flex-col gap-2">
                {data.posts.map((post) => (
                    <li key={`trending-${post._id}`} className="flex items-center">
                        <Link href={`/${post.author?.username}/post/${post._id}`}
                              className="flex flex-col w-full">
                            <span className="font-bold truncate">{post.content}</span>
                            <span className="text-slate-400 text-xs">
                                <span className="mr-1">{timeAgo(post.createdAt)} ago</span>
                                <span className="mr-1">·</span>
                                <span>{post.likeCount} {`${post.likeCount === 1 ? "like" : "likes"}`}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrendingBlock;
