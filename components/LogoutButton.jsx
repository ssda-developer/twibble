"use client";

import Icon from "@/components/Icon";
import { GUEST_PATH_REGEX } from "@/constants";
import { useUserContext } from "@/context/UserContext";
import { matchAny } from "@/utils";
import { usePathname, useRouter } from "next/navigation";

const LogoutButton = () => {
    const { logout } = useUserContext();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();

        if (!matchAny(pathname, GUEST_PATH_REGEX)) {
            router.push("/");
        } else {
            router.refresh();
        }
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
