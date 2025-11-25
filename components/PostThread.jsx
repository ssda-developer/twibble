"use client";

import { usePostById } from "@/app/features/hooks";
import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";
import PostList from "@/components/PostList";
import PostListData from "@/components/PostListData";
import { useUserContext } from "@/context/UserContext";

const PostThread = ({ id, username }) => {
    const { currentUser } = useUserContext();
    const { data } = usePostById(id, { currentUserId: currentUser?._id, includeParents: true });

    return (
        <>
            {data.parents && <PostList type="parents" posts={data.parents} />}
            <PostCard {...data.post} />
            <Composer parentId={id} placeholder="Post your reply" replyingToUser={username} />
            <PostListData parentId={id} type="reply" />
        </>
    );
};

export default PostThread;
