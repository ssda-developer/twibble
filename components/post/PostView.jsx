import PostThread from "@/components/post/PostThread";
import { Suspense } from "react";

export const PostView = ({ id, username }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostThread id={id} username={username} />
        </Suspense>
    );
};

