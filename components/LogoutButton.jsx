"use client";

import Icon from "@/components/Icon";
import { useUserContext } from "@/context/UserContext";

const LogoutButton = () => {
    const { logout } = useUserContext();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <button
            onClick={handleLogout}
            className="ml-auto px-2 py-2 text-slate-500 rounded-lg border border-slate-800 text-sm cursor-pointer"
        >
            <Icon name="arrow-right-start-on-rectangle" className="w-3 h-3" />
        </button>
    );
};

export default LogoutButton;
