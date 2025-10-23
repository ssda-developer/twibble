import ActionsBlock from "@/components/ActionsBlock";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/utils";
import Link from "next/link";

const TweetCard = ({ _id, user, content, createdAt, metrics }) => {
    // console.log(metrics);
    return (
        <Link href={`/${user.username}/tweet/${_id}`} className="flex p-4">
            <div className="mr-2">
                <Avatar letter={user.avatarInitials} />
            </div>
            <div className="flex-1">
                <div className="text-gray-400 mb-1">
                    <span className="font-bold mr-1 text-white">{user.name}</span>
                    <span className="mr-1">@{user.username}</span>
                    <span className="mr-1">·</span>
                    <span className="mr-1">{timeAgo(createdAt)}</span>
                </div>
                <p>{content}</p>
                <ActionsBlock retweets={metrics.retweets}
                              reposts={metrics.reposts}
                              likes={metrics.likes}
                              views={metrics.views}
                              tweetId={_id}
                />
            </div>
        </Link>
    );
};

export default TweetCard;
