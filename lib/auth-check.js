import { getCurrentUser } from "@/lib/auth";

export async function verifyOwner(usernameFromUrl) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.username.toLowerCase() !== usernameFromUrl.toLowerCase()) {
        return null;
    }

    return currentUser;
}
