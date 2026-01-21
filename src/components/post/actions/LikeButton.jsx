"use client";

import Button from "@/src/components/ui/Button";
import Icon from "@/src/components/ui/Icon";
import { ACTION_TYPES } from "@/src/constants/post-types";
import { useGlobalContext } from "@/src/context/GlobalContext";
import { useToggleLike } from "@/src/features/hooks";

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
