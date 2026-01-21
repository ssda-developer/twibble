import Button from "@/src/components/ui/Button";
import Icon from "@/src/components/ui/Icon";
import { useGlobalContext } from "@/src/context/GlobalContext";
import { useEffect, useState } from "react";

const RepostButton = ({ repostsCount, userState, onRepost }) => {
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
        <Button count={repostsCount} ariaLabel="Reposts" type="repost" onClick={handleRepost}
                isActive={reposted}>
            <Icon name="arrow-path-rounded-square" />
        </Button>
    );
};

export default RepostButton;
