"use client";

import Composer from "@/components/Composer";
import Icon from "@/components/Icon";
import PostList from "@/components/PostList";
import PostListData from "@/components/PostListData";
import Protected from "@/components/Protected";
import StatusBlock from "@/components/StatusBlock";
import { useGlobalContext } from "@/context/GlobalContext";
import { usePostById } from "@/features/hooks";

const PostThread = ({ id }) => {
    const { currentUser } = useGlobalContext();
    const { data } = usePostById(id, { currentUserId: currentUser?._id, includeParents: true });

    if (data.error) return <StatusBlock
        icon={<Icon name="exclamation-triangle" className="h-12 w-12" />}
        title="Post not found."
        description="The page you are looking for does not exist."
        hint={{ text: "Go back to the homepage.", link: "/" }}
    />;

    return (
        <>
            {data.parents && <PostList type="parents" posts={data.parents} />}
            <PostList type="detailed" posts={[data.post]} />
            <Protected>
                <Composer
                    mode="create"
                    placeholder="Post your reply"
                    kind="reply"
                    parentId={data?.post?._id}
                    replyingToUser={data?.post?.author?.username}
                    className="border-t border-slate-800"
                />
            </Protected>
            <PostListData parentId={id} type="reply" />
        </>
    );
};

export default PostThread;
