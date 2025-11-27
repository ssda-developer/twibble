"use client";

import { useTrendingPosts } from "@/app/features/hooks";
import Link from "next/link";

const TrendingBlock = () => {
    const { data } = useTrendingPosts();

    return (
        <div className="flex flex-col p-4 rounded-xl border border-slate-800">
            <h3 className="font-black mb-4 text-xl">Popular in 24 hours</h3>
            <ul className="flex flex-col">
                {data.posts.map((post) => (
                    <li key={`trending-${post._id}`} className="flex items-center mb-1">
                        <Link href={`http://localhost:3000/${post.author?.username}/post/${post._id}`}
                              className="w-full truncate">
                            {post.content}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrendingBlock;
