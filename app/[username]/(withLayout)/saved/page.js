"use client";

import PostListData from "@/components/PostListData";
import { useUserContext } from "@/context/UserContext";

const ProfileSavedPage = () => {
    const { currentUser } = useUserContext();

    return (
        <PostListData userId={currentUser?._id} type="userSaves" />
    );
};

export default ProfileSavedPage;
