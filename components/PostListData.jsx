"use client";

import InfinitePostList from "@/components/InfinitePostList";
import { Suspense } from "react";

const PostListData = ({ userId, parentId, type = "original" }) => {
    return (
        <Suspense fallback={<div>Loading Suspense PostListData...</div>}>
            <InfinitePostList userId={userId} parentId={parentId} type={type} />
        </Suspense>
    );
};

export default PostListData;
