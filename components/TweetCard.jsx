import ActionsBlock from "@/components/ActionsBlock";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/utils";
import Link from "next/link";

const TweetCard = ({ _id, authorSnapshot, type, content, createdAt, replyCount, repostCount, likeCount }) => {
    return (
        <Link href={`/${authorSnapshot.username}/post/${_id}`} className="flex p-4">
            <div className="mr-2">
                <Avatar letter={authorSnapshot.avatarInitials} />
            </div>
            <div className="flex-1">
                <div className="text-gray-400 mb-1">
                    <span className="font-bold mr-1 text-white">{authorSnapshot.displayName}</span>
                    <span className="mr-1">@{authorSnapshot.username}</span>
                    <span className="mr-1">·</span>
                    <span className="mr-1">{timeAgo(createdAt)}</span>
                </div>
                <p>type: {type}</p>
                <p>{content}</p>
                <ActionsBlock replies={replyCount}
                              reposts={repostCount}
                              likes={likeCount}
                              views=""
                              tweetId={_id}
                />
            </div>
        </Link>
    );
};

export default TweetCard;
