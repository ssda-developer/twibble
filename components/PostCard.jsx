import ActionClipboardButton from "@/components/ActionClipboardButton";
import ActionIconButton from "@/components/ActionIconButton";
import ActionLikeButton from "@/components/ActionLikeButton";
import ActionPostOptionsButton from "@/components/ActionPostOptionsButton";
import ActionRepliesButton from "@/components/ActionRepliesButton";
import ActionRepostButton from "@/components/ActionRepostButton";
import ActionSaveButton from "@/components/ActionSaveButton";
import Avatar from "@/components/Avatar";
import Composer from "@/components/Composer";
import MediaGallery from "@/components/MediaGallery";
import Modal from "@/components/Modal";
import { useDeletePost } from "@/features/hooks";
import { timeAgo } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PostCard = ({
                      _id,
                      author = {},
                      content = "",
                      media = [],
                      createdAt,
                      replyCount = 0,
                      repostCount = 0,
                      likeCount = 0,
                      userState = {},
                      repostedPost = null,
                      type = "post"
                  }) => {
    const [modalType, setModalType] = useState(null);
    const { mutate: deletePost, isLoading: isDeleting } = useDeletePost();

    const isParent = type === "parents";
    const isRepostType = type === "repost-inside";
    const postLink = `/${author?.username}/post/${_id}`;

    const openEdit = (e) => {
        e?.stopPropagation();
        setModalType("edit");
    };

    const openDelete = (e) => {
        e?.stopPropagation();
        setModalType("delete");
    };

    const openRepost = (e) => {
        e?.stopPropagation();
        setModalType("repost");
    };

    const openReply = (e) => {
        e?.stopPropagation();
        setModalType("reply");
    };

    const closeModal = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setModalType(null);
    };

    const handleConfirmDelete = (e) => {
        e?.preventDefault();
        e?.stopPropagation();

        deletePost(_id, {
            onSuccess: () => {
                setModalType(null);
            }
        });
    };

    const Wrapper = ({ children }) =>
        isRepostType ? (
            <div
                className={`flex ${
                    !isParent ? "p-4" : "px-4 pt-4"
                } border rounded-xl bg-slate-800/20 border-slate-800`}
            >
                {children}
            </div>
        ) : (
            <Link href={postLink} className={`flex ${!isParent ? "p-4" : "px-4 pt-4"}`}>
                {children}
            </Link>
        );

    const baseKind = "post";

    return (
        <>
            <Wrapper>
                <div className="mr-3 flex flex-col items-center">
                    <Avatar
                        colors={author?.avatar?.colors}
                        letter={author?.avatar?.initials}
                    />
                    {isParent && <div className="mt-4 w-px flex-1 bg-slate-800" />}
                </div>

                <div className="flex-1">
                    <PostHeader
                        author={author}
                        createdAt={createdAt}
                        postId={_id}
                        isRepostType={isRepostType}
                        onEdit={openEdit}
                        onDelete={openDelete}
                    />

                    <PostContent content={content} media={media} />

                    {repostedPost && (
                        <div className="mt-2">
                            <PostCard {...repostedPost} type="repost-inside" />
                        </div>
                    )}

                    {!isRepostType && (
                        <PostActions
                            postId={_id}
                            postLink={postLink}
                            replyCount={replyCount}
                            repostCount={repostCount}
                            likeCount={likeCount}
                            userState={userState}
                            onRepost={openRepost}
                            onReply={openReply}
                        />
                    )}
                </div>
            </Wrapper>

            <Modal
                open={modalType === "repost"}
                onClose={closeModal}
                ariaLabel="Repost dialog"
            >
                <Composer
                    mode="repost"
                    placeholder="Add a comment"
                    kind={baseKind}
                    postId={_id}
                    post={{
                        _id,
                        author,
                        content,
                        media,
                        createdAt,
                        replyCount,
                        repostCount,
                        likeCount,
                        userState
                    }}
                    onClose={() => setModalType(null)}
                    variant="modal"
                />
            </Modal>

            <Modal
                open={modalType === "edit"}
                onClose={closeModal}
                ariaLabel="Edit post dialog"
            >
                <Composer
                    mode="edit"
                    kind={baseKind}
                    postId={_id}
                    currentData={{ text: content, images: media }}
                    onClose={() => setModalType(null)}
                    variant="modal"
                />
            </Modal>

            <Modal
                open={modalType === "delete"}
                onClose={closeModal}
                ariaLabel="Delete post dialog"
            >
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-2">Delete post?</h2>
                    <p className="text-sm text-slate-400 mb-4">
                        This action cannot be undone. Are you sure you want to delete this post?
                    </p>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-full border border-slate-800 text-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setModalType(null);
                            }}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-full bg-red-600 text-sm font-semibold disabled:opacity-60"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={modalType === "reply"}
                onClose={closeModal}
                ariaLabel="Reply dialog"
            >
                <Composer
                    mode="create"
                    placeholder="Post your reply"
                    kind="reply"
                    parentId={_id}
                    replyingToUser={author?.username}
                    onClose={() => setModalType(null)}
                    variant="modal"
                />
            </Modal>
        </>
    );
};

const PostHeader = ({ author = {}, createdAt, postId, isRepostType, onEdit, onDelete }) => {
    const router = useRouter();

    const handlerUserPage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        router.push(`/${author?.username}/posts`);
    };

    return (
        <div className="mb-1 flex items-center">
            <div className="mr-auto text-slate-400">
            <span className="mr-1 font-bold text-white">
                {author?.displayName}
            </span>
                <span onClick={handlerUserPage}
                      className="mr-1 text-sky-500">@{author?.username}</span>
                <span className="mr-1">·</span>
                <span className="mr-1">{timeAgo(createdAt)}</span>
            </div>

            {!isRepostType && (
                <ActionPostOptionsButton
                    author={author}
                    postId={postId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
};

const PostContent = ({ content, media }) => (
    <div>
        {content && <p className="whitespace-pre-wrap">{content}</p>}
        {media?.length > 0 && (
            <div className="mt-2">
                <MediaGallery images={media} />
            </div>
        )}
    </div>
);

const PostActions = ({
                         postId,
                         postLink,
                         replyCount,
                         repostCount,
                         likeCount,
                         userState,
                         onRepost,
                         onReply
                     }) => (
    <div className="mx-[-8px] mt-2 flex justify-between text-sm text-slate-400">
        <ActionRepliesButton
            replyCount={replyCount}
            onReplies={onReply}
            userState={userState}
        />

        <ActionRepostButton
            repostsCount={repostCount}
            onRepost={onRepost}
            userState={userState}
        />

        <ActionLikeButton
            postId={postId}
            likeCount={likeCount}
            userState={userState}
        />

        <ActionIconButton
            iconName="chart-bar-square"
            isLocked={true}
            ariaLabel="Views"
        />

        <div className="flex space-x-1">
            <ActionSaveButton postId={postId} userState={userState} />
            <ActionClipboardButton postLink={postLink} />
        </div>
    </div>
);

export default PostCard;
