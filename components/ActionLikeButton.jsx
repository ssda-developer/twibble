"use client";

import { useToggleLike } from "@/app/features/posts/hooks";
import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useState } from "react";

const ActionLikeButton = ({ postId, userState, likeCount, currentUser }) => {
    const { mutate: toggleLike, isPending } = useToggleLike(currentUser._id);
    const [liked, setLiked] = useState(userState?.liked || false);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike({ postId, action: liked ? "unlike" : "like" });
        setLiked((prev) => !prev);
    };

    return (
        <ActionButton
            count={likeCount || 0}
            ariaLabel="Likes"
            onClick={handleClick}
            disabled={isPending}
            type="like"
            isActive={liked}
        >
            <Icon name={liked ? "heart" : "heart"} type={liked ? "solid" : undefined} />
        </ActionButton>
    );
};

export default ActionLikeButton;
