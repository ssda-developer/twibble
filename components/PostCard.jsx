import ActionButton from "@/components/ActionButton";
import ActionClipboardButton from "@/components/ActionClipboardButton";
import ActionLikeButton from "@/components/ActionLikeButton";
import ActionPostOptionsButton from "@/components/ActionPostOptionsButton";
import ActionRepostButton from "@/components/ActionRepostButton";
import ActionSaveButton from "@/components/ActionSaveButton";
import Avatar from "@/components/Avatar";
import Composer from "@/components/Composer";
import Icon from "@/components/Icon";
import MediaGallery from "@/components/MediaGallery";
import Modal from "@/components/Modal";
import { timeAgo } from "@/utils";
import { useState } from "react";

const PostCard = ({
                      _id,
                      author,
                      authorSnapshot,
                      content,
                      media,
                      createdAt,
                      replyCount,
                      repostCount,
                      likeCount,
                      userState,
                      originalPost,
                      type
                  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isReposting, setIsReposting] = useState(false);
    const postLink = `http://localhost:3000/${authorSnapshot.username}/post/${_id}`;
    const isParent = type === "parents";
    const isRepost = type === "repost";

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleRepost = () => {
        setIsReposting(true);
    };

    const handleCloseModal = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsEditing(false);
        setIsReposting(false);
    };

    return (
        <div href={postLink}
             className={`flex ${!isParent ? "p-4" : "px-4 pt-4"} ${isRepost && "border rounded-xl bg-slate-800/20  border-slate-800"}`}>
            <div className="mr-3 flex flex-col items-center">
                <Avatar colors={authorSnapshot?.avatarColors} letter={authorSnapshot.avatarInitials} />
                {isParent && <div className="mt-4 w-px flex-1 bg-slate-800" />}
            </div>

            <div className="flex-1">
                <div className="flex mb-1 items-center">
                    <div className="text-gray-400 mr-auto">
                        <span className="font-bold mr-1 text-white">{authorSnapshot.displayName}</span>
                        <span className="mr-1">@{authorSnapshot.username}</span>
                        <span className="mr-1">·</span>
                        <span className="mr-1">{timeAgo(createdAt)}</span>
                    </div>
                    {!isRepost &&
                        <ActionPostOptionsButton
                            author={author}
                            postId={_id}
                            onEdit={handleEdit}
                        />
                    }
                </div>
                <div>
                    <p>{content}</p>
                    {media.length > 0 &&
                        <div className="mt-2">
                            <MediaGallery images={media} />
                        </div>}
                </div>
                <div className="mt-2">
                    {originalPost && <PostCard {...originalPost} type="repost" />}
                </div>
                {!isRepost &&
                    <div className={`flex justify-between text-sm mt-2 mx-[-8px] text-gray-400`}>
                        <ActionButton count={replyCount} ariaLabel="Replies" type="replies">
                            <Icon name="chat-bubble-oval-left" />
                        </ActionButton>
                        <ActionRepostButton repostsCount={repostCount} onRepost={handleRepost} userState={userState} />
                        <ActionLikeButton postId={_id} likeCount={likeCount} userState={userState} />
                        <ActionButton count={0} ariaLabel="Views" type="views">
                            <Icon name="chart-bar-square" />
                        </ActionButton>
                        <div className="flex space-x-1">
                            <ActionSaveButton postId={_id} userState={userState} />
                            <ActionClipboardButton postLink={postLink} />
                        </div>
                    </div>
                }
            </div>
            <Modal open={isReposting} onClose={handleCloseModal} ariaLabel="Info dialog">
                <Composer post={{
                    _id,
                    author,
                    authorSnapshot,
                    content,
                    media,
                    createdAt,
                    replyCount,
                    repostCount,
                    likeCount,
                    userState,
                    type
                }} type="repost" postId={_id}
                          setIsReposting={setIsReposting} />
            </Modal>
            <Modal open={isEditing} onClose={handleCloseModal} ariaLabel="Info dialog">
                <Composer currentData={{ text: content, images: media }} type="edit" postId={_id}
                          setIsEditing={setIsEditing} />
            </Modal>
        </div>
    );
};

export default PostCard;
