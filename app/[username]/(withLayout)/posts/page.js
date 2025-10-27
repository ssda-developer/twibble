"use client";

import PostListData from "@/components/PostListData";
import { useUserContext } from "@/context/UserContext";

const ProfilePostsPage = () => {
    const { currentUser } = useUserContext();

    return (
        <PostListData userId={currentUser._id} type="userPosts" />
    );
};

export default ProfilePostsPage;
