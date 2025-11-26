"use client";

import InfinitePostList from "@/components/InfinitePostList";
import SkeletonList from "@/components/SkeletonList";
import { Suspense } from "react";

const PostListData = ({ user, parentId, type = "original" }) => {
    return (
        <Suspense fallback={<SkeletonList />}>
            <InfinitePostList user={user} parentId={parentId} type={type} />
        </Suspense>
    );
};

export default PostListData;
