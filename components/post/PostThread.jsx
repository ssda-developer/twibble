"use client";

import { usePostById } from "@/app/features/posts/hooks";
import Composer from "@/components/Composer";
import PostListData from "@/components/PostListData";
import TweetCardDetailed from "@/components/TweetCardDetailed";

const PostThread = ({ id, username }) => {
    const { data } = usePostById(id);

    return (
        <>
            <TweetCardDetailed {...data.post} />
            <Composer parentId={id} placeholder="Post your reply" replyingToUser={username} />
            <PostListData parentId={id} type="reply" />
        </>
    );
};

export default PostThread;
