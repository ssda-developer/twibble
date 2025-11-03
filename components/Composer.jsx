"use client";

import { useCreatePost } from "@/app/features/posts/hooks";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import { useUserContext } from "@/context/UserContext";
import { getRandomValue } from "@/utils";
import { useEffect, useRef, useState } from "react";

const Composer = ({
                      placeholder = "What’s happening?",
                      parentId = null,
                      replyingToUser = null
                  }) => {
    const { currentUser } = useUserContext();

    const [text, setText] = useState("");
    const createPost = useCreatePost();
    const textareaRef = useRef(null);
    const maxChars = 280;
    const remaining = maxChars - text.length;
    const overLimit = remaining < 0;
    const [imgLink, setImgLink] = useState("");

    useEffect(() => {
        const el = textareaRef.current;

        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [text]);

    const handleSubmit = () => {
        const arrayMedia = [];

        if (overLimit || !text.trim()) return;
        if (imgLink) {
            arrayMedia.push({
                url: imgLink,
                type: "image",
                meta: {}
            });
        }

        createPost.mutate({
            content: text.trim(),
            media: arrayMedia,
            parentId,
            userId: currentUser._id
        }, {
            onSuccess: () => {
                setText("");
                setImgLink("");
            }
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handlePhoto = (e) => {
        e.preventDefault();

        const link = `https://picsum.photos/60${getRandomValue(9)}/30${getRandomValue(9)}`;

        setImgLink(link);
    };

    return (
        <div className="border-b border-slate-800 p-4 flex">
            <div className="mr-2">
                <Avatar letter={currentUser?.avatarInitials} />
            </div>

            <div className="w-full">
                {parentId && replyingToUser && (
                    <p className="text-sm mb-1">Replying to <span className="text-sky-500">@{replyingToUser}</span></p>
                )}

                <div
                    className="flex-1 border-b border-slate-800 flex flex-col text-white font-semibold">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        rows={1}
                        className={`w-full bg-transparent text-xl py-3 mb-2 outline-none resize-none overflow-hidden placeholder-slate-500 leading-5 ${
                            overLimit ? "text-red-500" : "text-white"
                        }`}
                    />
                    {imgLink &&
                        <div className="flex rounded-xl overflow-hidden mb-6 relative">
                            <img src={imgLink} alt="image" className="object-contain w-full object-center" />
                            <button
                                className="flex bg-black/80 backdrop-blur-md hover:bg-black items-center p-2 rounded-full cursor-pointer transition absolute top-2 right-2"
                                onClick={() => setImgLink("")}>
                                <Icon name="x-mark" />
                            </button>
                        </div>
                    }
                </div>

                <div className="flex mt-4 items-center">
                    <div className="flex items-center justify-center text-white">
                        <button className="mr-2" onClick={handlePhoto}><Icon name="photo" /></button>
                        <button className="mr-2"><Icon name="gif" /></button>
                        <button className="mr-2"><Icon name="face-smile" /></button>
                    </div>

                    <span className={`ml-auto mr-3 text-sm ${overLimit ? "text-red-500" : "text-slate-400"}`}>
                        {remaining}
                    </span>

                    <button
                        className="bg-white px-3 py-1 font-bold text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={overLimit || !text.trim()}
                        onClick={handleSubmit}
                    >
                        {parentId ? "Reply" : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Composer;
