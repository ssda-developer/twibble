"use client";

import TweetList from "@/components/TweetList";
import { useUserContext } from "@/context/UserContext";

const ProfilePostsPage = () => {
    const { currentUser } = useUserContext();

    return (
        <div>
            Profile Posts Page
            <TweetList apiLink={`/api/posts?user=${currentUser._id}`} />
        </div>
    );
};

export default ProfilePostsPage;
