"use client";

import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";

const BackButton = ({ text = "", fallback = "/" }) => {
    const router = useRouter();

    const handleBack = () => {
        const history = JSON.parse(
            sessionStorage.getItem("nav-history") || "[]"
        );

        history.pop();

        const lastPath = history.pop();

        sessionStorage.setItem("nav-history", JSON.stringify(history));

        if (lastPath) {
            router.push(lastPath);
        } else {
            router.push(fallback);
        }
    };

    return (
        <button onClick={handleBack} className="flex items-center justify-center px-3 py-2 cursor-pointer">
            <Icon name="arrow-left" className="w-4 h-4" />
            {text && <span className="ml-2 font-bold">{text}</span>}
        </button>
    );
};

export default BackButton;
