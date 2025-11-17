import ActionPostOptionsButton from "@/components/ActionPostOptionsButton";
import ActionsBlock from "@/components/ActionsBlock";
import Avatar from "@/components/Avatar";
import Composer from "@/components/Composer";
import MediaGallery from "@/components/MediaGallery";
import Modal from "@/components/Modal";
import { timeAgo } from "@/utils";
import Link from "next/link";
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
                      userState
                  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const postLink = `http://localhost:3000/${authorSnapshot.username}/post/${_id}`;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCloseModal = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsEditing(false);
    };

    return (
        <Link href={postLink} className="flex p-4">
            <div className="mr-2">
                <Avatar letter={authorSnapshot.avatarInitials} />
            </div>
            <div className="flex-1">
                <div className="flex mb-1 items-center">
                    <div className="text-gray-400 mr-auto">
                        <span className="font-bold mr-1 text-white">{authorSnapshot.displayName}</span>
                        <span className="mr-1">@{authorSnapshot.username}</span>
                        <span className="mr-1">·</span>
                        <span className="mr-1">{timeAgo(createdAt)}</span>
                    </div>
                    <ActionPostOptionsButton
                        author={author}
                        postId={_id}
                        onEdit={handleEdit}
                    />
                </div>
                <div>
                    <p>{content}</p>
                    {media.length > 0 &&
                        <div className="mt-2">
                            <MediaGallery images={media} />
                        </div>}
                </div>
                <ActionsBlock replies={replyCount}
                              reposts={repostCount}
                              likes={likeCount}
                              views=""
                              tweetId={_id}
                              userState={userState}
                              postLink={postLink}
                />
            </div>
            <Modal open={isEditing} onClose={handleCloseModal} ariaLabel="Info dialog">
                <Composer currentData={{ text: content, images: media }} type="edit" postId={_id}
                          setIsEditing={setIsEditing} />
            </Modal>
        </Link>
    );
};

export default PostCard;
