import PostThread from "@/components/PostThread";
import { Suspense } from "react";

export const PostView = ({ id, username }) => {
    return (
        <Suspense fallback={<div>Loading Suspense PostView...</div>}>
            <PostThread id={id} username={username} />
        </Suspense>
    );
};

