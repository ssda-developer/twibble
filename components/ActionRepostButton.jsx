import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";

const ActionRepostButton = ({ repostsCount, userState, onRepost }) => {
    const { currentUser, triggerAuthAttention } = useGlobalContext();
    const [reposted, setReposted] = useState(userState?.reposted || false);

    const handleRepost = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            triggerAuthAttention();
            return;
        }

        if (onRepost) onRepost();
    };

    useEffect(() => {
        setReposted(userState?.reposted || false);
    }, [userState?.reposted]);

    return (
        <ActionButton count={repostsCount} ariaLabel="Reposts" type="repost" onClick={handleRepost}
                      isActive={reposted}>
            <Icon name="arrow-path-rounded-square" />
        </ActionButton>
    );
};

export default ActionRepostButton;
