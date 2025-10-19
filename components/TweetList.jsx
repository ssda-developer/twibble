"use client";
import TweetCard from "@/components/TweetCard";
import { useEffect, useState } from "react";

const TweetList = () => {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        async function fetchTweets() {
            const res = await fetch("/api/tweets");
            const data = await res.json();
            setTweets(data);
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
