"use client";

import MediaGallery from "@/src/components/post/MediaGallery";
import PostCard from "@/src/components/post/PostCard";
import Avatar from "@/src/components/ui/Avatar";
import IconButton from "@/src/components/ui/IconButton";
import { POST_MAX_LENGTH } from "@/src/constants/validation";
import { useGlobalContext } from "@/src/context/GlobalContext";
import { useCreatePost, useEditPost } from "@/src/features/hooks";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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
    const textareaRef = useRef(null);

    const createPostMutation = useCreatePost();
    const editPostMutation = useEditPost();

    const isOverLimit = text.length > POST_MAX_LENGTH;
    const isSubmitting = createPostMutation.isPending || editPostMutation.isPending;
    const canSubmit = text.trim() && !isOverLimit && !isSubmitting;

    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, []);

    useEffect(() => {
        adjustTextareaHeight();
    }, [text, adjustTextareaHeight]);

    const handleSuccess = () => {
        setText("");
        setImages([]);
        if (onClose) onClose();
    };

    const getSubmissionPayload = () => ({
        content: text.trim(),
        media: images,
        parentId: kind === "reply" ? parentId : (mode === "edit" ? post?.parentId : null),
        userId: currentUser?._id
    });

    const handleSubmit = useCallback(() => {
        if (!canSubmit) return;

        const payload = getSubmissionPayload();

        if (mode === "edit" && postId) {
            editPostMutation.mutate({ postId, ...payload }, { onSuccess: handleSuccess });
        } else if (mode === "repost" && post) {
            createPostMutation.mutate({ ...payload, repostId: post._id }, { onSuccess: handleSuccess });
        } else {
            createPostMutation.mutate(payload, { onSuccess: handleSuccess });
        }
    }, [canSubmit, mode, postId, post, text, images, currentUser, editPostMutation, createPostMutation]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const addMockImage = () => {
        const seed = Math.floor(Math.random() * 10000);
        const mockUrl = `https://picsum.photos/seed/${seed}/600/300`;
        setImages(prev => [...prev, { url: mockUrl }]);
    };

    return (
        <div className={`flex ${variant === "modal" ? "pt-3" : "p-4"} border-slate-800 ${className}`}>
            <div className="mr-3 shrink-0">
                <Avatar
                    colors={currentUser?.avatar?.colors}
                    letter={currentUser?.avatar?.initials}
                />
            </div>

            <div className="flex-1">
                {kind === "reply" && replyingToUser && (
                    <p className="mb-2 text-sm text-slate-500">
                        Replying to{" "}
                        <Link href={`/${replyingToUser}/posted`} className="text-sky-500 hover:underline">
                            @{replyingToUser}
                        </Link>
                    </p>
                )}

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className="w-full mt-2 bg-transparent text-xl outline-none resize-none placeholder-slate-500 overflow-hidden"
                />

                {images.length > 0 && (
                    <div className="my-3">
                        <MediaGallery
                            images={images}
                            editable
                            onRemove={(idx) => setImages(prev => prev.filter((_, i) => i !== idx))}
                        />
                    </div>
                )}

                {mode === "repost" && post && (
                    <div
                        className="mt-2 border border-slate-800 rounded-2xl overflow-hidden pointer-events-none opacity-80">
                        <PostCard post={post} type="repost-inside" />
                    </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-800">
                    <div className="flex text-sky-500">
                        <IconButton iconName="photo" onClick={addMockImage} />
                        <IconButton iconName="face-smile" isLocked />
                        <IconButton iconName="map-pin" isLocked />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${isOverLimit ? "text-red-500" : "text-slate-500"}`}>
                            {POST_MAX_LENGTH - text.length}
                        </span>
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="bg-white text-black px-6 py-1.5 rounded-full font-bold disabled:opacity-50 transition hover:bg-slate-200 active:scale-95"
                        >
                            {isSubmitting ? "..." : (mode === "edit" ? "Save" : "Post")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Composer;
