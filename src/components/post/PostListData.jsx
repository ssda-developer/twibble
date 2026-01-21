"use client";

import InfinitePostList from "@/src/components/post/InfinitePostList";
import SkeletonList from "@/src/components/post/SkeletonList";
import { Suspense } from "react";

const PostListData = ({ user, parentId, type = "default" }) => {
    return (
        <Suspense fallback={<SkeletonList />}>
            <InfinitePostList user={user} parentId={parentId} type={type} />
        </Suspense>
    );
};

export default PostListData;
