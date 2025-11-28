"use client";

import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";
import { useState } from "react";

const ActionClipboardButton = ({ postLink }) => {
    const [status, setStatus] = useState("idle");
    const statusMap = {
        idle: { icon: <Icon name="clipboard-document" />, text: "Copy Link" },
        copied: { icon: <Icon name="clipboard-document-check" type="solid" />, text: "Copied" },
        error: { icon: <Icon name="x-mark" />, text: "Failed to copy" }
    };
    const { icon, text } = statusMap[status];

    const copyLink = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await navigator.clipboard.writeText(postLink);
            setStatus("copied");
            setTimeout(() => setStatus("idle"), 1000);
        } catch (error) {
            console.error("Failed to copy:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 1000);
        }
    };

    return (
        <ActionButton ariaLabel={text} type="share" onClick={copyLink}>
            {icon}
        </ActionButton>
    );
};

export default ActionClipboardButton;
