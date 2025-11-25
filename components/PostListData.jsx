"use client";

import InfinitePostList from "@/components/InfinitePostList";
import SkeletonList from "@/components/SkeletonList";
import { Suspense } from "react";

const PostListData = ({ userId, parentId, type = "original" }) => {
    return (
        <Suspense fallback={<SkeletonList />}>
            <InfinitePostList userId={userId} parentId={parentId} type={type} />
        </Suspense>
    );
};

export default PostListData;
