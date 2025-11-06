"use client";

import { useDeletePost } from "@/app/features/posts/hooks";
import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useRef, useState } from "react";

const MenuItem = ({ keyLi, icon, label, onClick }) => {
    return (
        <li key={keyLi}>
            <button
                className="w-full flex items-center px-4 py-1 hover:underline cursor-pointer"
                onClick={onClick}
            >
                <Icon name={icon} className="w-4 h-4 mr-2" />
                {label}
            </button>
        </li>
    );
};

const ActionPostOptionsButton = ({ onEdit, postId, author }) => {
    const { currentUser } = useUserContext();
    const [isShow, setIsShow] = useState(false);
    const { mutate: deletePost, isLoading } = useDeletePost();

    const dropdownRef = useRef(null);

    const handleHide = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsShow((prev) => !prev);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onEdit) onEdit();
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();

        deletePost(postId, {
            onSuccess: () => {
                console.log("deleted");
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const mainMenu = [
        { icon: "eye-slash", label: "Hide", onClick: handleHide }
    ];

    const authorMenu = author === currentUser._id ? [
        { icon: "pencil-square", label: "Edit", onClick: handleEdit },
        { icon: "trash", label: "Delete", onClick: handleDelete }
    ] : [];


    return (
        <div className="z-10 relative" ref={dropdownRef}>
            <ActionButton ariaLabel="options" onClick={handleHide}>
                <Icon name="ellipsis-horizontal" />
            </ActionButton>

            <div id="dropdownDots"
                 className={`absolute right-0 ${!isShow && "hidden"} border border-slate-800 rounded-xl bg-black/80 backdrop-blur-md min-w-28`}>
                <ul className="py-2 text-sm">
                    {mainMenu.map((item, index) => (
                        <MenuItem key={`${item.label}-${index}`} {...item} />
                    ))}
                </ul>

                {authorMenu.length > 0 && (
                    <ul className="py-2 text-sm border-t border-slate-800">
                        {authorMenu.map((item, index) => (
                            <MenuItem key={`${item.label}-${index}`} {...item} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ActionPostOptionsButton;
