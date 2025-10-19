import ActionsBlock from "@/components/ActionsBlock";
import Avatar from "@/components/Avatar";
import Link from "next/link";

const TweetCard = ({ id, user, content, timestamp, retweets, reposts, likes, views }) => {
    return (
        <Link href={`/${user.username}/posts/${id}`} className="flex p-4">
            <div className="mr-2">
                <Avatar letter={user.avatar} />
            </div>
            <div className="flex-1">
                <div className="text-gray-400 mb-1">
                    <span className="font-bold mr-1 text-white">{user.name}</span>
                    <span className="mr-1">{user.username}</span>
                    <span className="mr-1">·</span>
                    <span className="mr-1">{timestamp}</span>
                </div>
                <p>{content}</p>
                <ActionsBlock retweets={retweets} reposts={reposts} likes={likes} views={views} />
            </div>
        </Link>
    );
};

export default TweetCard;
