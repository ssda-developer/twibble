"use client";

import { useUserContext } from "@/context/UserContext";

export default function LogoutButton() {
    const { logout } = useUserContext();
    // const router = useRouter();

    const handleLogout = async () => {
        await logout();
        // router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="px-3 py-1 rounded border text-sm"
        >
            Logout
        </button>
    );
}
