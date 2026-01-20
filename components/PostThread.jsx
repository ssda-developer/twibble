"use client";

import Composer from "@/components/Composer";
import Icon from "@/components/Icon";
import PostList from "@/components/PostList";
import PostListData from "@/components/PostListData";
import Protected from "@/components/Protected";
import SkeletonList from "@/components/SkeletonList";
import StatusBlock from "@/components/StatusBlock";
import { useGlobalContext } from "@/context/GlobalContext";
import { usePostById } from "@/features/hooks";

const PostBlock = ({ id }) => {
    const { userFetchStatus, currentUser } = useGlobalContext();

    const { data, isLoading, isError } = usePostById(id, {
        currentUserId: currentUser?._id,
        includeParents: true
    });

    if (isLoading || userFetchStatus === "idle") {
        return <SkeletonList count={3} />;
    }

    if (isError || !data?.post) {
        return (
            <StatusBlock
                icon={<Icon name="exclamation-triangle" className="h-12 w-12 text-slate-500" />}
                title="Post not found"
                description="This post might have been deleted or the link is incorrect."
                hint={{ text: "Back to Home", link: "/" }}
            />
        );
    }

    return (
        <div className="pb-20">
            {data.parents?.length > 0 && (
                <PostList type="parents" posts={data.parents} />
            )}

            <PostList type="detailed" posts={[data.post]} />

            <Protected>
                <div className="border-t border-slate-800">
                    <Composer
                        mode="create"
                        kind="reply"
                        parentId={data.post._id}
                        replyingToUser={data.post.author?.username}
                        placeholder="Post your reply"
                    />
                </div>
            </Protected>

            <PostListData parentId={id} type="reply" />
        </div>
    );
};

export default PostBlock;
