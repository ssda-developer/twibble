"use client";

import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import { useEffect, useRef, useState } from "react";

const Composer = ({ placeholder = "What’s happening?", parentId = null }) => {
    const [text, setText] = useState("");
    const maxChars = 160;
    const remaining = maxChars - text.length;
    const overLimit = remaining < 0;
    const textareaRef = useRef(null);

    useEffect(() => {
        const el = textareaRef.current;

        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [text]);

    const handlerClick = async () => {
        try {
            const body = {
                content: text,
                parentId: parentId
            };

            const res = await fetch("/api/tweets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error:", errorData);
                return;
            }

            const data = await res.json();
            setText("");
            // window.dispatchEvent(new CustomEvent("tweets:created", { detail: data }));
            console.log("Response:", data);
        } catch (err) {
            console.error("POST error:", err);
        }
    };

    return (
        <div className="border-b border-slate-800 p-4 flex">
            <div className="mr-2">
                <Avatar letter="SS" />
            </div>
            <div className="w-full">
                <div
                    className="flex-1 border-b border-slate-800 flex items-center justify-center text-white font-semibold">
                    <textarea
                        ref={textareaRef}
                        id="textarea-composer"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={placeholder}
                        rows={1}
                        className={`w-full bg-transparent text-xl py-3 mb-2 outline-none resize-none overflow-hidden placeholder-slate-500 leading-5 ${overLimit ? "text-red-500" : "text-white"}`}
                    />
                </div>
                <div className="flex mt-4 items-center">
                    <div className="flex items-center justify-center text-white">
                        <button className="mr-2">
                            <Icon name="photo" />
                        </button>
                        <button className="mr-2">
                            <Icon name="gif" />
                        </button>
                        <button className="mr-2">
                            <Icon name="face-smile" />
                        </button>
                    </div>
                    <span
                        className={`ml-auto mr-3 text-sm ${overLimit ? "text-red-500" : "text-slate-400"}`}
                        aria-live="polite"
                        title={`There are ${maxChars} characters left.`}
                    >
                        {remaining}
                    </span>
                    <button
                        className="bg-white px-3 py-1 font-bold text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={overLimit || !text.trim()}
                        onClick={handlerClick}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Composer;
