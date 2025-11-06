"use client";

import { usePostById } from "@/app/features/posts/hooks";
import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";
import PostListData from "@/components/PostListData";
import { useUserContext } from "@/context/UserContext";

const PostThread = ({ id, username }) => {
    const { currentUser } = useUserContext();

    const { data } = usePostById(id, { currentUserId: currentUser._id });

    return (
        <>
            {/*<TweetCardDetailed {...data.post} />*/}
            <PostCard {...data.post} />
            <Composer parentId={id} placeholder="Post your reply" replyingToUser={username} />
            <PostListData parentId={id} type="reply" />
        </>
    );
};

export default PostThread;
