"use client";

import Protected from "@/src/components/auth/Protected";
import Composer from "@/src/components/post/Composer";
import PostList from "@/src/components/post/PostList";
import PostListData from "@/src/components/post/PostListData";
import SkeletonList from "@/src/components/post/SkeletonList";
import EmptyState from "@/src/components/ui/EmptyState";
import Icon from "@/src/components/ui/Icon";
import { useGlobalContext } from "@/src/context/GlobalContext";
import { usePostById } from "@/src/features/hooks";

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
            <EmptyState
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
