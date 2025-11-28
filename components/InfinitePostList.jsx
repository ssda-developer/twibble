"use client";

import { useUserContext } from "@/context/UserContext";
import { useInfinitePosts, useInfiniteReplies, useInfiniteUserItems } from "@/features/hooks";
import { useEffect, useRef } from "react";
import PostList from "./PostList";

const InfinitePostList = ({ user, parentId, type }) => {
    const { currentUser } = useUserContext();

    let query;
    let posts;

    switch (type) {
        case "reply":
            query = useInfiniteReplies(parentId);
            posts = query.data?.pages.flatMap(page => page.replies) || [];
            break;
        case "user-posted":
            query = useInfiniteUserItems({ user, type: "posts", params: { currentUserId: currentUser?._id } });
            posts = query.data?.pages.flatMap(page => page.posts) || [];
            break;
        case "user-replied":
            query = useInfiniteUserItems({ user, type: "replies", params: { currentUserId: currentUser?._id } });
            posts = query.data?.pages.flatMap(page => page.replies) || [];
            break;
        case "user-saved":
            query = useInfiniteUserItems({ user, type: "saves", params: { currentUserId: currentUser?._id } });
            posts = query.data?.pages.flatMap(page => page.saves) || [];
            break;
        case "user-liked":
            query = useInfiniteUserItems({ user, type: "likes", params: { currentUserId: currentUser?._id } });
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
            <PostList posts={posts} type={type} />

            <div ref={loaderRef} className="py-4 text-center">
                {isFetchingNextPage && "Loading more..."}
            </div>
        </>
    );
};

export default InfinitePostList;
