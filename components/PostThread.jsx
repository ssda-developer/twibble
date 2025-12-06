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
    if (userFetchStatus === "idle") return null;

    const currentUserId = userFetchStatus === "found" ? currentUser?._id : undefined;

    const { data, isLoading } = usePostById(id, {
        currentUserId,
        includeParents: true
    });

    if (isLoading) return <SkeletonList count={1} />;

    if (data?.error) return (
        <StatusBlock
            icon={<Icon name="exclamation-triangle" className="h-12 w-12" />}
            title="Post not found."
            description="The page you are looking for does not exist."
            hint={{ text: "Go back to the homepage.", link: "/" }}
        />
    );

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

const PostThread = ({ id }) => {
    const { userFetchStatus } = useGlobalContext();

    // Показываем Skeleton, пока не пытались получить пользователя
    if (userFetchStatus === "idle") return <SkeletonList count={1} />;

    return <PostBlock id={id} />;
};

export default PostThread;
