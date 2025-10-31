import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createPost,
    fetchPostById,
    fetchPosts,
    fetchReplies,
    fetchUserPosts,
    fetchUserReplies,
    toggleLike,
    toggleSave
} from "./api";
import { POSTS_STALE_TIME, postsKeys } from "./keys";

export function usePosts(params = {}) {
    return useQuery({
        queryKey: postsKeys.lists.infinite(params),
        queryFn: () => fetchPosts(params),
        staleTime: POSTS_STALE_TIME,
        suspense: true
    });
}

export function usePostById(id, params = {}) {
    return useQuery({
        queryKey: postsKeys.lists.byId(id),
        queryFn: () => fetchPostById(id, params),
        staleTime: POSTS_STALE_TIME,
        suspense: true
    });
}

export function useReplies(postId, params = {}) {
    return useQuery({
        queryKey: postsKeys.lists.replies(postId, params),
        queryFn: () => fetchReplies(postId, params),
        staleTime: POSTS_STALE_TIME,
        suspense: true
    });
}

export function useInfinitePosts({ currentUserId, ...params } = {}) {
    return useInfiniteQuery({
        queryKey: postsKeys.lists.infinite({ ...params, currentUserId }),
        queryFn: ({ pageParam }) => fetchPosts({ ...params, currentUserId, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: POSTS_STALE_TIME,
        suspense: true
    });
}

export function useInfiniteReplies(postId, params = {}) {
    return useInfiniteQuery({
        queryKey: postsKeys.lists.infiniteReplies(postId, params),
        queryFn: ({ pageParam }) => fetchReplies(postId, { ...params, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: POSTS_STALE_TIME,
        suspense: true
    });
}

export function useInfiniteUserItems({ userId, type = "posts", params = {} }) {
    const fetchFn = type === "posts" ? fetchUserPosts : fetchUserReplies;

    const keyFn =
        type === "posts"
            ? postsKeys.lists.infiniteByUser
            : (id, p) => postsKeys.lists.infiniteByUser(id, { ...p, type: "replies" });

    return useInfiniteQuery({
        queryKey: keyFn(userId, params),
        queryFn: ({ pageParam }) => fetchFn(userId, { ...params, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: POSTS_STALE_TIME,
        suspense: true,
        enabled: !!userId
    });
}

export function useToggleLike(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, action }) => toggleLike(postId, userId, action),

        onMutate: async ({ postId, action }) => {
            await queryClient.cancelQueries(postsKeys.lists.byId(postId));

            const previousPost = queryClient.getQueryData(postsKeys.lists.byId(postId));

            if (previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(postId), old => ({
                    ...old,
                    likeCount: action === "like" ? old.likeCount + 1 : Math.max(0, old.likeCount - 1)
                }));
            }

            return { previousPost };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(context.previousPost._id), context.previousPost);
            }
        },

        onSuccess: (_data) => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === "posts" });
        }
    });
}

export function useToggleSave(userId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, action }) => toggleSave(postId, userId, action),

        onMutate: async ({ postId, action }) => {
            await queryClient.cancelQueries(postsKeys.lists.byId(postId));

            const previousPost = queryClient.getQueryData(postsKeys.lists.byId(postId));

            if (previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(postId), old => ({
                    ...old,
                    saveCount: action === "save" ? old.saveCount + 1 : Math.max(0, old.saveCount - 1)
                }));
            }

            return { previousPost };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(context.previousPost._id), context.previousPost);
            }
        },

        onSuccess: (_data) => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === "posts" });
        }
    });
}

export function useCreatePost() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createPost,

        onMutate: async (newPost) => {
            await qc.cancelQueries(postsKeys.all);

            const prevData = qc.getQueryData(postsKeys.all);

            qc.setQueryData(postsKeys.all, (old = []) => [
                { ...newPost, _id: `optimistic-${Date.now()}` },
                ...old
            ]);

            return { prevData };
        },

        onError: (_err, _newPost, ctx) => {
            if (ctx?.prevData) {
                qc.setQueryData(postsKeys.all, ctx.prevData);
            }
        },

        onSuccess: () => {
            qc.invalidateQueries(postsKeys.all);
        }
    });
}
