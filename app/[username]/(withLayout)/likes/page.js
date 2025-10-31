"use client";

import PostListData from "@/components/PostListData";
import { useUserContext } from "@/context/UserContext";

const ProfileLikesPage = () => {
    const { currentUser } = useUserContext();

    return (
        <PostListData userId={currentUser._id} type="userLikes" />
    );
};

export default ProfileLikesPage;
