"use client";

import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";
import PostList from "@/components/PostList";
import PostListData from "@/components/PostListData";
import { useUserContext } from "@/context/UserContext";
import { usePostById } from "@/features/hooks";

const PostThread = ({ id }) => {
    const { currentUser } = useUserContext();
    const { data } = usePostById(id, { currentUserId: currentUser?._id, includeParents: true });

    return (
        <>
            {data.parents && <PostList type="parents" posts={data.parents} />}
            <PostCard {...data.post} />
            <Composer
                mode="create"
                placeholder="Post your reply"
                kind="reply"
                parentId={data?.post?._id}
                replyingToUser={data?.post?.author?.username}
                className="border-t border-slate-800"
            />
            <PostListData parentId={id} type="reply" />
        </>
    );
};

export default PostThread;
