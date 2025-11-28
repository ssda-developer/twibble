import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";

const ActionRepliesButton = ({ replyCount, userState, onReplies }) => {
    const { currentUser, triggerAuthAttention } = useUserContext();
    const [replied, setReplied] = useState(userState?.replied || false);

    const handleReplies = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            triggerAuthAttention();
            return;
        }

        if (onReplies) onReplies();
    };

    useEffect(() => {
        setReplied(userState?.replied || false);
    }, [userState?.replied]);

    return (
        <ActionButton count={replyCount} ariaLabel="Replies" type="reply" onClick={handleReplies}
                      isActive={replied}>
            <Icon name="chat-bubble-oval-left" />
        </ActionButton>
    );
};

export default ActionRepliesButton;
