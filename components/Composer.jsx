"use client";

import { useCreatePost, useEditPost, useRepostPost } from "@/app/features/hooks";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import MediaGallery from "@/components/MediaGallery";
import PostCard from "@/components/PostCard";
import { useUserContext } from "@/context/UserContext";
import { getRandomValue } from "@/utils";
import { useEffect, useRef, useState } from "react";

function ComposerTextarea({ value, onChange, onKeyDown, placeholder }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;

        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [ref, value]);

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
                             overLimit,
                             onAddPhoto,
                             onAddGif,
                             onAddEmoji,
                             onSubmit,
                             isDisabled,
                             type
                         }) {
    return (
        <div className="flex mt-4 items-center">
            <div className="flex items-center justify-center text-white">
                <button type="button" className="mr-2" onClick={onAddPhoto} aria-label="Add photo">
                    <Icon name="photo" />
                </button>
                <button type="button" className="mr-2" onClick={onAddGif} aria-label="Add gif">
                    <Icon name="gif" />
                </button>
                <button type="button" className="mr-2" onClick={onAddEmoji} aria-label="Add emoji">
                    <Icon name="face-smile" />
                </button>
            </div>

            <span className={`ml-auto mr-3 text-sm ${overLimit ? "text-red-500" : "text-slate-400"}`}>
                {remaining}
            </span>
            <button
                type="button"
                className="capitalize bg-white px-3 py-1 font-bold text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDisabled}
                onClick={onSubmit}
            >
                {type}
            </button>
        </div>
    );
}

export default function Composer({
                                     currentData = { text: "", images: [] },
                                     placeholder = "What’s happening?",
                                     parentId = null,
                                     replyingToUser = null,
                                     type = "post",
                                     postId = null,
                                     setIsEditing,
                                     setIsReposting,
                                     post = null
                                 }) {
    const { currentUser } = useUserContext();
    const [text, setText] = useState(currentData.text);
    const [imgLinks, setImgLinks] = useState(currentData.images);
    const createPost = useCreatePost();
    const editPost = useEditPost();
    const repostPost = useRepostPost();

    const maxChars = 280;
    const remaining = maxChars - text.length;
    const overLimit = remaining < 0;

    const handleSubmit = () => {
        if (overLimit || !text.trim()) return;

        if (type === "repost") {
            repostPost.mutate(
                {
                    postId: postId,
                    content: text.trim(),
                    media: imgLinks,
                    parentId,
                    userId: currentUser?._id,
                    originalId: post._id
                },
                {
                    onSuccess: () => {
                        setText("");
                        setImgLinks([]);
                        setIsReposting(false);
                    }
                }
            );
        } else if (type === "edit") {
            editPost.mutate(
                {
                    postId: postId,
                    content: {
                        content: text.trim(),
                        media: imgLinks, //TODO: fixed edit imgs
                        parentId,
                        userId: currentUser?._id
                    }
                },
                {
                    onSuccess: () => {
                        setText("");
                        setImgLinks([]);
                        setIsEditing(false);
                    }
                }
            );
        } else {
            createPost.mutate(
                {
                    content: text.trim(),
                    media: imgLinks,
                    parentId,
                    userId: currentUser?._id
                },
                {
                    onSuccess: () => {
                        setText("");
                        setImgLinks([]);
                    }
                }
            );
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handlePhoto = (e) => {
        e.preventDefault();

        const link = `https://picsum.photos/id/${getRandomValue(1000)}/600/300`;

        setImgLinks(prev => [...prev, { url: link }]);
    };

    const handleRemovePhoto = (indexToRemove) => {
        setImgLinks(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleGif = (e) => e.preventDefault();
    const handleEmoji = (e) => e.preventDefault();

    return (
        <div className="p-4 flex">
            <div className="mr-2">
                <Avatar colors={currentUser?.avatarColors} letter={currentUser?.avatarInitials} />
            </div>

            <div className="w-full">
                {parentId && replyingToUser && (
                    <p className="text-sm mb-1">Replying to <span className="text-sky-500">@{replyingToUser}</span></p>
                )}

                <div
                    className={`flex-1 border-b border-slate-800 flex flex-col text-white font-semibold ${imgLinks.length && "pb-6"}`}>
                    <ComposerTextarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                    />

                    <MediaGallery images={imgLinks} editable={true} onRemove={handleRemovePhoto} />
                    {post && <PostCard {...post} type="repost" />}
                </div>

                <ComposerActions
                    remaining={remaining}
                    overLimit={overLimit}
                    onAddPhoto={handlePhoto}
                    onAddGif={handleGif}
                    onAddEmoji={handleEmoji}
                    onSubmit={handleSubmit}
                    isDisabled={overLimit || !text.trim()}
                    isReply={!!parentId}
                    type={type}
                />
            </div>
        </div>
    );
}
