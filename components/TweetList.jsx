"use client";
import TweetCard from "@/components/TweetCard";
import { useEffect, useState } from "react";

const TweetList = ({ apiLink = null }) => {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        if (!apiLink) return;

        async function fetchTweets() {
            const res = await fetch(apiLink);
            const data = await res.json();

            setTweets(Array.isArray(data) ? [...data].reverse() : []);
        }

        fetchTweets();
    }, []);

    return (
        <ul>
            {tweets.map((tweet, idx) => (
                <li key={`${tweet.user.user}-${idx}`} className="border-b border-slate-800">
                    <TweetCard {...tweet} />
                </li>
            ))}
        </ul>
    );
};

export default TweetList;
