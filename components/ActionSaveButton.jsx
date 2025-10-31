import { useToggleSave } from "@/app/features/posts/hooks";
import Icon from "@/components/Icon";
import { useState } from "react";

const ActionSaveButton = ({ postId, userState, currentUser }) => {

    const { mutate: toggleSave, isPending } = useToggleSave(currentUser._id);
    const [saved, setSaved] = useState(userState?.saved || false);

    const handleSaved = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        toggleSave({
            postId: postId,
            action: saved ? "unsave" : "save"
        });
        setSaved((prev) => !prev);
    };
    return (
        <button className="flex items-center cursor-pointer p-1 rounded-full hover:text-blue-500" disabled={isPending}
                onClick={handleSaved}>
            {saved ? <Icon name="bookmark" type="solid" /> : <Icon name="bookmark" />}
        </button>
    );
};

export default ActionSaveButton;
