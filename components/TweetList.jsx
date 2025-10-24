"use client";
import TweetCard from "@/components/TweetCard";
import { useEffect, useState } from "react";

const TweetList = ({ apiLink = null }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!apiLink) return;

        async function fetchTweets() {
            const res = await fetch(apiLink);
            const data = await res.json();

            setPosts(Array.isArray(data) ? [...data] : []);
        }

        fetchTweets();
    }, []);

    return (
        <ul>
            {posts.map((post, idx) => (
                <li key={`${post.user.user}-${idx}`} className="border-b border-slate-800">
                    <TweetCard {...post} />
                </li>
            ))}
        </ul>
    );
};

export default TweetList;
