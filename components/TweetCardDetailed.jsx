import ActionsBlock from "@/components/ActionsBlock";
import Avatar from "@/components/Avatar";

const TweetCardDetailed = ({ _id, authorSnapshot, content, replyCount, repostCount, likeCount }) => {
    return (
        <div className="flex flex-col p-4">
            <div className="flex mb-2">
                <Avatar colors={authorSnapshot?.avatarColors} letter={authorSnapshot?.avatarInitials} />
                <div className="flex flex-col text-gray-400 ml-1">
                    <span className="font-bold mr-1 text-white">{authorSnapshot?.displayName}</span>
                    <span className="mr-1">{authorSnapshot?.username}</span>
                </div>
            </div>
            <div className="flex-1">
                <p className="text-lg">{content}</p>
                <time className="flex my-3 text-gray-400">3:42 PM · Oct 18, 2025</time>
                <ActionsBlock replies={replyCount}
                              reposts={repostCount}
                              likes={likeCount}
                              views="0"
                              tweetId={_id}
                              classes="py-2 border-y border-slate-800"
                />
            </div>
        </div>
    );
};

export default TweetCardDetailed;
