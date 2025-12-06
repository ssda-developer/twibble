"use client";

import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useGlobalContext } from "@/context/GlobalContext";
import { useToggleSave } from "@/features/hooks";

const ActionSaveButton = ({ postId, userState }) => {
    const { currentUser, triggerAuthAttention } = useGlobalContext();
    const { mutate: toggleSave, isPending } = useToggleSave(currentUser?._id);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            triggerAuthAttention();
            return;
        }

        toggleSave({ postId, action: userState.saved ? "unsave" : "save" });
    };

    return (
        <ActionButton
            ariaLabel="Save"
            onClick={handleToggle}
            disabled={isPending}
            type="save"
            isActive={userState.saved}
        >
            <Icon name="bookmark" type={userState.saved ? "solid" : undefined} />
        </ActionButton>
    );
};

export default ActionSaveButton;
