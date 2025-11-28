"use client";

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

const ActionPostOptionsButton = ({ onEdit, onDelete, author }) => {
    const { currentUser } = useUserContext();
    const [isShow, setIsShow] = useState(false);
    const isCurrentUser = author._id === currentUser?._id;

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

        if (onDelete) onDelete();
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

    const menu = [
        { icon: "pencil-square", label: "Edit", onClick: handleEdit },
        { icon: "trash", label: "Delete", onClick: handleDelete }
    ];

    if (!isCurrentUser) return false;

    return (
        <div className="z-10 relative" ref={dropdownRef}>
            <ActionButton ariaLabel="options" onClick={handleHide}>
                <Icon name="ellipsis-horizontal" />
            </ActionButton>

            <div id="dropdownDots"
                 className={`absolute right-0 ${!isShow && "hidden"} border border-slate-800 rounded-xl bg-black/80 backdrop-blur-md min-w-28`}>
                <ul className="py-2 text-sm">
                    {menu.map((item, index) => (
                        <MenuItem key={`${item.label}-${index}`} {...item} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ActionPostOptionsButton;
