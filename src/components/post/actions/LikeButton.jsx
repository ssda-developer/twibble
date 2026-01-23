"use client";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { ACTION_TYPES } from "@/constants/post-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { useToggleLike } from "@/features/hooks";

const LikeButton = ({ postId, userState, likeCount }) => {
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
            action: userState.liked ? ACTION_TYPES.UNLIKE : ACTION_TYPES.LIKE
        });
    };

    return (
        <Button
            count={likeCount}
            ariaLabel="Likes"
            onClick={handleLikeToggle}
            disabled={isPending}
            type={ACTION_TYPES.LIKE}
            isActive={userState.liked}
        >
            <Icon
                name="heart"
                type={userState.liked ? "solid" : undefined}
            />
        </Button>
    );
};

export default LikeButton;
