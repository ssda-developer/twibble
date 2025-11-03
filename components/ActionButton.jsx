"use client";

import { formatCount } from "@/utils";

const ActionButton = ({
                          count = 0,
                          ariaLabel,
                          children,
                          onClick,
                          disabled,
                          isActive,
                          type = "default",
                          classes = ""
                      }) => {
    const formatted = formatCount(count);

    const colors = {
        replies: {
            text: "text-blue-500",
            hover: "hover:bg-blue-500/10 hover:text-blue-500"
        },
        reposts: {
            text: "text-green-500",
            hover: "hover:bg-green-500/10 hover:text-green-500"
        },
        like: {
            text: "text-red-500",
            hover: "hover:bg-red-500/10 hover:text-red-500"
        },
        views: {
            text: "text-purple-500",
            hover: "hover:bg-purple-500/10 hover:text-purple-500"
        },
        save: {
            text: "text-sky-500",
            hover: "hover:bg-sky-500/10 hover:text-sky-500"
        },
        share: {
            text: "text-orange-500",
            hover: "hover:bg-orange-500/10 hover:text-orange-500"
        },
        default: {
            text: "text-gray-500",
            hover: "hover:bg-gray-500/10"
        }
    };

    return (
        <button
            className={`flex items-center p-2 rounded-full group relative cursor-pointer transition ${colors[type].hover} ${isActive && colors[type].text} ${classes} `}
            aria-label={ariaLabel}
            title={ariaLabel}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
            {formatted > 0 && <span className="ml-1">{formatted}</span>}
        </button>
    );
};

export default ActionButton;
