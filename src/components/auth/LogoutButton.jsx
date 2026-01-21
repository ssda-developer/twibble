"use client";

import Icon from "@/src/components/ui/Icon";
import { useGlobalContext } from "@/src/context/GlobalContext";

const LogoutButton = ({ text, classes }) => {
    const { logout } = useGlobalContext();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <button
            onClick={handleLogout}
            className={`flex items-center ml-auto ${text ? "w-full px-4 py-2" : "px-2 py-2"} text-slate-500 rounded-lg border border-slate-800 text-sm cursor-pointer ${classes}`}
        >
            <Icon name="arrow-right-start-on-rectangle" className="w-3 h-3" />
            {text && <span className="ml-1">{text}</span>}
        </button>
    );
};

export default LogoutButton;
