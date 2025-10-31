"use client";

import { usePostById } from "@/app/features/posts/hooks";
import Composer from "@/components/Composer";
import PostListData from "@/components/PostListData";
import TweetCard from "@/components/TweetCard";
import { useUserContext } from "@/context/UserContext";

const PostThread = ({ id, username }) => {
    const { currentUser } = useUserContext();
    
    const { data } = usePostById(id, { currentUserId: currentUser._id });

    return (
        <>
            {/*<TweetCardDetailed {...data.post} />*/}
            <TweetCard {...data.post} />
            <Composer parentId={id} placeholder="Post your reply" replyingToUser={username} />
            <PostListData parentId={id} type="reply" />
        </>
    );
};

export default PostThread;
