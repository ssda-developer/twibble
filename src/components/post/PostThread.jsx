"use client";

import Protected from "@/components/auth/Protected";
import Composer from "@/components/post/Composer";
import PostList from "@/components/post/PostList";
import PostListData from "@/components/post/PostListData";
import SkeletonList from "@/components/post/SkeletonList";
import EmptyState from "@/components/ui/EmptyState";
import Icon from "@/components/ui/Icon";
import { useGlobalContext } from "@/context/GlobalContext";
import { usePostById } from "@/features/hooks";

const PostBlock = ({ id }) => {
    const { userLoading, currentUser } = useGlobalContext();

    const { data, isLoading, isError, isFetching } = usePostById(id, {
        currentUserId: currentUser?._id,
        includeParents: true
    });

    const isActuallyLoading = userLoading || isLoading || (isFetching && !data?.post);

    if (isActuallyLoading) {
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
