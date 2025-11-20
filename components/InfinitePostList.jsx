"use client";

import { useInfinitePosts, useInfiniteReplies, useInfiniteUserItems } from "@/app/features/hooks";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useRef } from "react";
import PostList from "./PostList";

const InfinitePostList = ({ userId, parentId, type }) => {
    const { currentUser } = useUserContext();

    let query;
    let posts;

    switch (type) {
        case "reply":
            query = useInfiniteReplies(parentId);
            posts = query.data?.pages.flatMap(page => page.replies) || [];
            break;
        case "userPosts":
            query = useInfiniteUserItems({ userId, type: "posts" });
            posts = query.data?.pages.flatMap(page => page.posts) || [];
            break;
        case "userReplies":
            query = useInfiniteUserItems({ userId, type: "replies" });
            posts = query.data?.pages.flatMap(page => page.replies) || [];
            break;
        case "userSaves":
            query = useInfiniteUserItems({ userId, type: "saves" });
            posts = query.data?.pages.flatMap(page => page.saves) || [];
            break;
        case "userLikes":
            query = useInfiniteUserItems({ userId, type: "likes" });
            posts = query.data?.pages.flatMap(page => page.likes) || [];
            break;
        default:
            query = useInfinitePosts({ currentUserId: currentUser?._id });
            posts = query.data?.pages.flatMap(page => page.posts) || [];
    }

    const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;
    const loaderRef = useRef(null);

    useEffect(() => {
        if (!hasNextPage) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) fetchNextPage();
        });

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);

    return (
        <>
            <PostList posts={posts} />

            <div ref={loaderRef} className="py-4 text-center">
                {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                        ? "Scroll to load more"
                        : `No more ${type}`}
            </div>
        </>
    );
};

export default InfinitePostList;
