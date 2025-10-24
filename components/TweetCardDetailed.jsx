import ActionsBlock from "@/components/ActionsBlock";
import Avatar from "@/components/Avatar";

const TweetCardDetailed = ({ _id, user, content, metrics }) => {
    return (
        <div className="flex flex-col p-4">
            <div className="flex mb-2">
                <Avatar letter={user.avatarInitials} />
                <div className="flex flex-col text-gray-400 ml-1">
                    <span className="font-bold mr-1 text-white">{user.name}</span>
                    <span className="mr-1">{user.username}</span>
                </div>
            </div>
            <div className="flex-1">
                <p className="text-lg">{content}</p>
                <time className="flex my-3 text-gray-400">3:42 PM · Oct 18, 2025</time>
                <ActionsBlock retweets={metrics.retweets}
                              reposts={metrics.reposts}
                              likes={metrics.likes}
                              views={metrics.views}
                              tweetId={_id}
                />
            </div>
        </div>
    );
};

export default TweetCardDetailed;
