"use client";

import { useToggleSave } from "@/app/features/posts/hooks";
import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useState } from "react";

const ActionSaveButton = ({ postId, userState, currentUser }) => {
    const { mutate: toggleSave, isPending } = useToggleSave(currentUser._id);
    const [saved, setSaved] = useState(userState?.saved || false);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave({ postId, action: saved ? "unsave" : "save" });
        setSaved((prev) => !prev);
    };

    return (
        <ActionButton
            ariaLabel="Save"
            onClick={handleClick}
            disabled={isPending}
            type="save"
            isActive={saved}
        >
            <Icon name="bookmark" type={saved ? "solid" : undefined} />
        </ActionButton>
    );
};

export default ActionSaveButton;
