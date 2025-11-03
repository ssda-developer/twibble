import ActionPostOptionsButton from "@/components/ActionPostOptionsButton";
import ActionsBlock from "@/components/ActionsBlock";
import Avatar from "@/components/Avatar";
import { timeAgo } from "@/utils";
import Link from "next/link";

const PostCard = ({
                      _id,
                      author,
                      authorSnapshot,
                      type,
                      content,
                      media,
                      createdAt,
                      replyCount,
                      repostCount,
                      likeCount,
                      userState
                  }) => {
    return (
        <Link href={`/${authorSnapshot.username}/post/${_id}`} className="flex p-4">
            <div className="mr-2">
                <Avatar letter={authorSnapshot.avatarInitials} />
            </div>
            <div className="flex-1">
                <div className="flex mb-1">
                    <div className="text-gray-400 mr-auto">
                        <span className="font-bold mr-1 text-white">{authorSnapshot.displayName}</span>
                        <span className="mr-1">@{authorSnapshot.username}</span>
                        <span className="mr-1">·</span>
                        <span className="mr-1">{timeAgo(createdAt)}</span>
                    </div>
                    <ActionPostOptionsButton author={author} postId={_id} />
                </div>
                {/*<p>type: {type}</p>*/}
                <p>{content}</p>
                {media.length > 0 && <div className="mt-2">
                    <img src={media[0].url} className="rounded-xl" alt={media[0].meta?.title} />
                </div>}
                <ActionsBlock replies={replyCount}
                              reposts={repostCount}
                              likes={likeCount}
                              views=""
                              tweetId={_id}
                              userState={userState}
                />
            </div>
        </Link>
    );
};

export default PostCard;
