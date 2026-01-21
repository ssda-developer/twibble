import CopyButton from "@/src/components/post/actions/CopyButton";
import LikeButton from "@/src/components/post/actions/LikeButton";
import PostOptions from "@/src/components/post/actions/PostOptions";
import ReplyButton from "@/src/components/post/actions/ReplyButton";
import RepostButton from "@/src/components/post/actions/RepostButton";
import SaveButton from "@/src/components/post/actions/SaveButton";
import Composer from "@/src/components/post/Composer";
import MediaGallery from "@/src/components/post/MediaGallery";
import Avatar from "@/src/components/ui/Avatar";
import Modal from "@/src/components/ui/Modal";
import { useDeletePost } from "@/src/features/hooks";
import { timeAgo } from "@/src/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";

const PostCard = ({ post, type = "post" }) => {
    if (!post) return null;

    const {
        _id,
        author = {},
        content = "",
        media = [],
        createdAt,
        replyCount = 0,
        repostCount = 0,
        likeCount = 0,
        userState = {},
        repostedPost = null
    } = post;
    const [modalType, setModalType] = useState(null);
    const { mutate: deletePost, isLoading: isDeleting } = useDeletePost();
    const router = useRouter();
    const isParent = type === "parents";
    const isRepostType = type === "repost-inside";
    const isDetailed = type === "detailed";
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
                router.push("/");
                setModalType(null);
            }
        });
    };

    return (
        <>
            <PostWrapper isRepostType={isRepostType} isParent={isParent} isDetailed={isDetailed} postLink={postLink}>
                <div className={`flex ${isDetailed ? "flex-row mb-2" : "flex-col mr-3"} items-center`}>
                    <Avatar
                        colors={author?.avatar?.colors}
                        letter={author?.avatar?.initials}
                    />
                    {isParent && <div className="mt-4 w-px flex-1 bg-slate-800" />}
                    {isDetailed && <PostHeader
                        author={author}
                        createdAt={createdAt}
                        postId={_id}
                        isRepostType={isRepostType}
                        isDetailed={isDetailed}
                        onEdit={openEdit}
                        onDelete={openDelete}
                    />}
                </div>

                <div className="flex-1">
                    {!isDetailed && <PostHeader
                        author={author}
                        createdAt={createdAt}
                        postId={_id}
                        isRepostType={isRepostType}
                        isDetailed={isDetailed}
                        onEdit={openEdit}
                        onDelete={openDelete}
                    />}

                    <PostContent content={content} media={media} />

                    {repostedPost && (
                        <div className="mt-2">
                            <PostCard post={repostedPost} type="repost-inside" />
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
            </PostWrapper>

            <Modal
                open={modalType === "repost"}
                onClose={closeModal}
                ariaLabel="Repost dialog"
            >
                <Composer
                    mode="repost"
                    placeholder="Post your reply"
                    kind="repost"
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
                    kind="edit"
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
                    placeholder="Add a comment"
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

const PostHeader = ({ author = {}, createdAt, postId, isRepostType, isDetailed, onEdit, onDelete }) => {
    const router = useRouter();

    const handlerUserPage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        router.push(`/${author?.username}/posted`);
    };

    return (
        <div className={`mb-1 flex items-center ${isDetailed && "ml-3 w-full"}`}>
            <div className={`mr-auto text-slate-400 ${isDetailed && "flex flex-col"}`}>
            <span className="mr-1 font-bold text-white">
                {author?.displayName}
            </span>
                <span className={`${isDetailed && "text-sm"}`}>
                    <span onClick={handlerUserPage}
                          className="mr-1 text-sky-500">@{author?.username}</span>
                    <span className="mr-1">·</span>
                    <span className="mr-1">{timeAgo(createdAt)}</span>
                </span>
            </div>

            {!isRepostType && (
                <PostOptions
                    author={author}
                    postId={postId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
};

const PostWrapper = ({ isRepostType, isParent, isDetailed, postLink, children }) => {
    if (isRepostType) {
        return (
            <div
                className={`flex ${!isParent ? "p-4" : "px-4 pt-4"} border rounded-xl bg-slate-800/20 border-slate-800 ${isDetailed && "flex-col"}`}>
                {children}
            </div>
        );
    }

    return (
        <Link href={postLink} className={`flex ${!isParent ? "p-4" : "px-4 pt-4"} ${isDetailed && "flex-col"}`}>
            {children}
        </Link>
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
        <div className="flex space-x-1">
            <ReplyButton replyCount={replyCount} onReplies={onReply} userState={userState} />
            <RepostButton repostsCount={repostCount} onRepost={onRepost} userState={userState} />
        </div>
        <LikeButton postId={postId} likeCount={likeCount} userState={userState} />
        <div className="flex space-x-1">
            <SaveButton postId={postId} userState={userState} />
            <CopyButton postLink={postLink} />
        </div>
    </div>
);

export default memo(PostCard);
