"use client";

import { useToggleLike } from "@/app/features/posts/hooks";
import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";

const ActionsBlock = ({ classes, replies, reposts, likes = 0, views, userState, tweetId }) => {
    const { currentUser } = useUserContext();

    const { mutate: toggleLike, isPending } = useToggleLike(currentUser._id);
    const [liked, setLiked] = useState(userState?.liked || false);

    const handleLiked = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        toggleLike({
            postId: tweetId,
            action: liked ? "unlike" : "like"
        });
        setLiked((prev) => !prev);
    };

    return (
        <div className={`flex justify-between text-gray-400 text-sm mt-2 mx-[-4px] ${classes}`}>
            <ActionButton
                count={replies}
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
                count={likes}
                className={`hover:text-red-400 ${liked && "text-red-500"}`}
                ariaLabel="Likes"
                clickHandler={handleLiked}
                disabled={isPending}
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
