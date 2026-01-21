import Button from "@/src/components/ui/Button";
import Icon from "@/src/components/ui/Icon";
import { useGlobalContext } from "@/src/context/GlobalContext";
import { useEffect, useState } from "react";

const ReplyButton = ({ replyCount, userState, onReplies }) => {
    const { currentUser, triggerAuthAttention } = useGlobalContext();
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
        <Button count={replyCount} ariaLabel="Replies" type="reply" onClick={handleReplies}
                isActive={replied}>
            <Icon name="chat-bubble-oval-left" />
        </Button>
    );
};

export default ReplyButton;
