"use client";

import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";

const ActionsBlock = ({ classes, retweets, reposts, likes = [], views, tweetId }) => {
    const { currentUser } = useUserContext();

    const [currentLikes, setCurrentLikes] = useState(likes.length);
    const [liked, setLiked] = useState(() => {
        return likes.filter(like => like === currentUser._id).length > 0;
    });

    const onLikeClick = async (e, userId = currentUser._id) => {
        e.preventDefault();
        e.stopPropagation();

        const res = await fetch(`/api/posts/${tweetId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: liked ? "unlike" : "like", userId })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Failed to toggle like");
        }

        setCurrentLikes((prev) => liked ? prev - 1 : prev + 1);
        setLiked((prev) => !prev);
        return res.json();
    };


    return (
        <div className={`flex justify-between text-gray-400 text-sm mt-2 mx-[-4px] ${classes}`}>
            <ActionButton
                count={retweets}
                className="hover:text-blue-500"
                ariaLabel="Retweets"
            >
                <Icon name="chat-bubble-oval-left" />
            </ActionButton>
            <ActionButton
                count={reposts}
                className="hover:text-green-500"
                ariaLabel="Reposts"
            >
                <Icon name="arrow-path-rounded-square" />
            </ActionButton>
            <ActionButton
                count={currentLikes}
                className={`hover:text-red-400 ${liked && "text-red-500"}`}
                ariaLabel="Likes"
                clickHandler={onLikeClick}
            >
                {liked ? <Icon name="heart" type="solid" /> : <Icon name="heart" />}
            </ActionButton>
            <ActionButton
                count={views}
                className="hover:text-purple-500"
                ariaLabel="Views"
            >
                <Icon name="chart-bar-square" />
            </ActionButton>
            <div className="flex">
                <button className="flex items-center cursor-pointer p-1 rounded-full hover:text-blue-500">
                    <Icon name="bookmark" />
                </button>
                <button className="flex items-center cursor-pointer p-1 ml-1 rounded-full hover:text-blue-500">
                    <Icon name="arrow-up-tray" />
                </button>
            </div>
        </div>
    );
};

export default ActionsBlock;
