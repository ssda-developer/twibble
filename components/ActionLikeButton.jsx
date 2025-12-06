"use client";

import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useGlobalContext } from "@/context/GlobalContext";
import { useToggleLike } from "@/features/hooks";

const ActionLikeButton = ({ postId, userState, likeCount }) => {
    const { currentUser, triggerAuthAttention } = useGlobalContext();

    const { mutate: toggleLike, isPending } = useToggleLike(currentUser?._id);

    const handleLikeToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            triggerAuthAttention();
            return;
        }

        if (isPending) return;

        toggleLike({
            postId,
            action: userState.liked ? "unlike" : "like"
        });
    };

    return (
        <ActionButton
            count={likeCount}
            ariaLabel="Likes"
            onClick={handleLikeToggle}
            disabled={isPending}
            type="like"
            isActive={userState.liked}
        >
            <Icon
                name="heart"
                type={userState.liked ? "solid" : undefined}
            />
        </ActionButton>
    );
};

export default ActionLikeButton;
