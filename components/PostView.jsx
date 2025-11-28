import PostThread from "@/components/PostThread";
import SkeletonList from "@/components/SkeletonList";
import { Suspense } from "react";

const PostView = ({ id, username }) => {
    return (
        <Suspense fallback={<SkeletonList />}>
            <PostThread id={id} username={username} />
        </Suspense>
    );
};

export default PostView;

