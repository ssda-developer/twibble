"use client";

import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useGlobalContext } from "@/context/GlobalContext";
import { useToggleSave } from "@/features/hooks";
import { useEffect, useState } from "react";

const ActionSaveButton = ({ postId, userState }) => {
    const { currentUser, triggerAuthAttention } = useGlobalContext();
    const { mutate: toggleSave, isPending } = useToggleSave(currentUser?._id);
    const [saved, setSaved] = useState(userState?.saved || false);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            triggerAuthAttention();
            return;
        }

        toggleSave({ postId, action: saved ? "unsave" : "save" });
        setSaved((prev) => !prev);
    };

    useEffect(() => {
        setSaved(userState?.saved || false);
    }, [userState?.saved]);

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
