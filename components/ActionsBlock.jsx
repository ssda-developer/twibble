"use client";

import ActionButton from "@/components/ActionButton";
import ActionClipboardButton from "@/components/ActionClipboardButton";
import ActionLikeButton from "@/components/ActionLikeButton";
import ActionSaveButton from "@/components/ActionSaveButton";
import Icon from "@/components/Icon";

const ActionsBlock = ({ tweetId, replies, reposts, likes, views, userState, classes, postLink }) => {
    return (
        <div className={`flex justify-between text-sm mt-2 mx-[-8px] text-gray-400 ${classes}`}>
            <ActionButton count={replies} ariaLabel="Replies" type="replies">
                <Icon name="chat-bubble-oval-left" />
            </ActionButton>
            <ActionButton count={reposts} ariaLabel="Reposts" type="reposts">
                <Icon name="arrow-path-rounded-square" />
            </ActionButton>
            <ActionLikeButton postId={tweetId} likeCount={likes} userState={userState} />
            <ActionButton count={views} ariaLabel="Views" type="views">
                <Icon name="chart-bar-square" />
            </ActionButton>
            <div className="flex space-x-1">
                <ActionSaveButton postId={tweetId} userState={userState} />
                <ActionClipboardButton postLink={postLink} />
            </div>
        </div>
    );
};

export default ActionsBlock;
