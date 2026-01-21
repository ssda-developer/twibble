"use client";

import Button from "@/src/components/ui/Button";
import Icon from "@/src/components/ui/Icon";
import { ACTION_TYPES } from "@/src/constants/post-types";
import { useGlobalContext } from "@/src/context/GlobalContext";
import { useToggleSave } from "@/src/features/hooks";

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
