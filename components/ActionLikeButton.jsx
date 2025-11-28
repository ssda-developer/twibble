"use client";

import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useUserContext } from "@/context/UserContext";
import { useToggleLike } from "@/features/hooks";
import { useEffect, useState } from "react";

const ActionLikeButton = ({ postId, userState, likeCount }) => {
    const { currentUser, triggerAuthAttention } = useUserContext();
    const { mutate: toggleLike, isPending } = useToggleLike(currentUser?._id);
    const [liked, setLiked] = useState(userState?.liked || false);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            triggerAuthAttention();
            return;
        }

        if (isPending) return;

        toggleLike({ postId, action: liked ? "unlike" : "like" });
        setLiked((prev) => !prev);
    };

    useEffect(() => {
        setLiked(userState?.liked || false);
    }, [userState?.liked]);

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
