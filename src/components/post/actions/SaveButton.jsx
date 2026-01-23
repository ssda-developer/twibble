"use client";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { ACTION_TYPES } from "@/constants/post-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { useToggleSave } from "@/features/hooks";

const SaveButton = ({ postId, userState }) => {
    const { currentUser, triggerAuthAttention } = useGlobalContext();
    const { mutate: toggleSave, isPending } = useToggleSave(currentUser?._id);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            triggerAuthAttention();
            return;
        }

        toggleSave({ postId, action: userState.saved ? ACTION_TYPES.UNSAVE : ACTION_TYPES.SAVE });
    };

    return (
        <Button
            ariaLabel="Save"
            onClick={handleToggle}
            disabled={isPending}
            type={ACTION_TYPES.SAVE}
            isActive={userState.saved}
        >
            <Icon name="bookmark" type={userState.saved ? "solid" : undefined} />
        </Button>
    );
};

export default SaveButton;
