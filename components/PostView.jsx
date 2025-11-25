import PostThread from "@/components/PostThread";
import SkeletonList from "@/components/SkeletonList";
import { Suspense } from "react";

export const PostView = ({ id, username }) => {
    return (
        <Suspense fallback={<SkeletonList />}>
            <PostThread id={id} username={username} />
        </Suspense>
    );
};

