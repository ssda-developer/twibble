"use client";

import InfinitePostList from "@/components/post/InfinitePostList";
import SkeletonList from "@/components/post/SkeletonList";
import { Suspense } from "react";

const PostListData = ({ user, parentId, type = "default" }) => {
    return (
        <Suspense fallback={<SkeletonList />}>
            <InfinitePostList user={user} parentId={parentId} type={type} />
        </Suspense>
    );
};

export default PostListData;
