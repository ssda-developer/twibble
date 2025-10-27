"use client";

import { usePosts, useReplies, useUserPosts } from "@/app/features/posts/hooks";
import PostList from "@/components/PostList";
import { Suspense } from "react";

const PostListData = ({ userId, parentId, type = "original" }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostListContent userId={userId} parentId={parentId} type={type} />
        </Suspense>
    );
};

const PostListContent = ({ userId, parentId, type }) => {
    let data;

    switch (type) {
        case "reply":
            data = useReplies(parentId)?.data?.replies;
            break;
        case "userPosts":
            data = useUserPosts({ author: userId })?.data?.posts;
            break;
        default:
            data = usePosts()?.data?.posts;
    }

    return <PostList posts={data} />;
};

export default PostListData;
