"use client";

import ActionIconButton from "@/components/ActionIconButton";
import Avatar from "@/components/Avatar";
import MediaGallery from "@/components/MediaGallery";
import PostCard from "@/components/PostCard";
import { useGlobalContext } from "@/context/GlobalContext";
import { useCreatePost, useEditPost, useRepostPost } from "@/features/hooks";
import { getRandomValue } from "@/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const MAX_CHARS = 280;

function ComposerTextarea({ value, onChange, onKeyDown, placeholder }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    return (
        <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-transparent text-xl py-3 mb-2 outline-none resize-none overflow-hidden placeholder-slate-500 leading-5"
        />
    );
}

function ComposerActions({
                             remaining,
                             isOverLimit,
                             onAddPhoto,
                             onSubmit,
                             isDisabled,
                             mode,
                             kind,
                             variant
                         }) {
    const getButtonLabel = () => {
        if (mode === "edit") return "Save";
        if (mode === "repost") return "Repost";
        if (mode === "create" && kind === "reply") return "Reply";
        return "Post";
    };

    const isModal = variant === "modal";
    const buttonLabel = getButtonLabel();

    return (
        <div
            className={`mt-4 flex ${isModal && "flex-col"} sm:flex-row ${isModal ? "items-end" : "items-center"} sm:items-center`}>
            <div className="flex w-full">
                <div className="flex items-center justify-center text-white">
                    <ActionIconButton
                        iconName="photo"
                        onClick={onAddPhoto}
                        ariaLabel="Add photo"
                        className="text-sky-500"
                    />
                    <ActionIconButton
                        iconName="gif"
                        isLocked={true}
                        ariaLabel="Add gif"
                        className="text-sky-500"
                    />
                    <ActionIconButton
                        iconName="list-bullet"
                        isLocked={true}
                        ariaLabel="Add poll"
                        className="text-sky-500"
                    />
                    <ActionIconButton
                        iconName="face-smile"
                        isLocked={true}
                        className="text-sky-500"
                        ariaLabel="Add emoji"
                    />
                    <ActionIconButton
                        iconName="map-pin"
                        isLocked={true}
                        className="text-sky-500"
                        ariaLabel="Add location"
                    />
                    <ActionIconButton
                        iconName="calendar-days"
                        isLocked={true}
                        className="text-sky-500"
                        ariaLabel="Add schedule"
                    />
                </div>

                <span
                    className={`ml-auto mr-3 text-sm ${
                        isOverLimit ? "text-red-500" : "text-slate-400"
                    }`}
                >
                {remaining}
            </span>
            </div>

            <button
                type="button"
                className={`rounded-full ${isModal && "mt-3"} sm:m-0 bg-white px-3 py-1 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={isDisabled}
                onClick={onSubmit}
            >
                {buttonLabel}
            </button>
        </div>
    );
}

const Composer = ({
                      currentData = { text: "", images: [] },
                      placeholder = "What’s happening?",
                      parentId = null,
                      replyingToUser = null,
                      mode = "create",
                      kind = "post",
                      postId = null,
                      post = null,
                      onClose,
                      className = "",
                      variant = "default"
                  }) => {
    const { currentUser } = useGlobalContext();
    const [text, setText] = useState(currentData.text || "");
    const [images, setImages] = useState(currentData.images || []);

    const createPost = useCreatePost();
    const editPost = useEditPost();
    const repostPost = useRepostPost();

    const isReply = kind === "reply";
    const isModal = variant === "modal";

    const remaining = MAX_CHARS - text.length;
    const isOverLimit = remaining < 0;

    const handleSubmit = () => {
        if (isOverLimit || !text.trim()) return;

        const trimmed = text.trim();
        const userId = currentUser?._id;

        if (mode === "repost" && postId && post) {
            repostPost.mutate(
                {
                    postId,
                    content: trimmed,
                    media: images,
                    userId,
                    repostId: post._id,
                    parentId: isReply ? parentId : null
                },
                {
                    onSuccess: () => {
                        setText("");
                        setImages([]);
                        if (onClose) onClose();
                    }
                }
            );
            return;
        }

        if (mode === "edit" && postId) {
            editPost.mutate(
                {
                    postId,
                    content: {
                        content: trimmed,
                        media: images,
                        parentId,
                        userId
                    }
                },
                {
                    onSuccess: () => {
                        setText("");
                        setImages([]);
                        if (onClose) onClose();
                    }
                }
            );
            return;
        }

        createPost.mutate(
            {
                content: trimmed,
                media: images,
                parentId: isReply ? parentId : null,
                userId
            },
            {
                onSuccess: () => {
                    setText("");
                    setImages([]);
                    if (onClose) onClose();
                }
            }
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleAddPhoto = (e) => {
        e.preventDefault();
        const link = `https://picsum.photos/id/${getRandomValue(1000)}/600/300`;
        setImages(prev => [...prev, { url: link }]);
    };

    const handleRemovePhoto = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className={`flex ${isModal ? "pt-3" : "p-4"} sm:p-4 ${className}`}>
            <div className="mr-2">
                <Avatar
                    colors={currentUser?.avatar?.colors}
                    letter={currentUser?.avatar?.initials}
                />
            </div>

            <div className="w-full">
                {isReply && replyingToUser && (
                    <p className="mb-1 text-sm">
                        Replying to{" "}
                        <Link href={`/${replyingToUser}/posts`} className="text-sky-500">@{replyingToUser}</Link>
                    </p>
                )}
                <div
                    className={`flex flex-1 flex-col border-b border-slate-800 font-semibold text-white ${
                        images.length || mode === "repost" ? "pb-6" : ""
                    }`}
                >
                    <ComposerTextarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                    />

                    {images.length > 0 && (
                        <MediaGallery
                            images={images}
                            editable
                            onRemove={handleRemovePhoto}
                        />
                    )}

                    {post && mode === "repost" && (
                        <div className="mt-2">
                            <PostCard {...post} type="repost-inside" />
                        </div>
                    )}
                </div>

                <ComposerActions
                    remaining={remaining}
                    isOverLimit={isOverLimit}
                    onAddPhoto={handleAddPhoto}
                    onSubmit={handleSubmit}
                    isDisabled={isOverLimit || !text.trim()}
                    mode={mode}
                    kind={kind}
                    variant={variant}
                />
            </div>
        </div>
    );
};

export default Composer;
