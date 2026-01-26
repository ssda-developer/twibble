"use client";

import { ACTION_TYPES } from "@/constants/post-types";
import { AUTH_KEY, CACHE_CONFIG, POSTS_ROOT_KEY, QUERY_KEYS, USERS_ROOT_KEY } from "@/constants/query-config";
import { useGlobalContext } from "@/context/GlobalContext";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createPost,
    deletePost,
    editPost,
    fetchMe,
    fetchPostById,
    fetchPosts,
    fetchReplies,
    fetchTrendingPosts,
    fetchUserByNameOrId,
    fetchUserLiked,
    fetchUserPosted,
    fetchUserReplied,
    fetchUserSaved,
    loginRequest,
    logoutRequest,
    registerRequest,
    toggleLike,
    toggleSave
} from "./api";

const updatePostInCache = (queryClient, postId, updateFn) => {
    const idStr = String(postId);

    queryClient.setQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false }, (oldData) => {
        if (!oldData) return oldData;

        const mapPost = (post) => (String(post._id) === idStr ? updateFn(post) : post);

        if (oldData.pages) {
            return {
                ...oldData,
                pages: oldData.pages.map(page => {
                    const key = Object.keys(page).find(k => Array.isArray(page[k]));

                    return key ? { ...page, [key]: page[key].map(mapPost) } : page;
                })
            };
        }

        if (oldData.post) {
            return {
                ...oldData,
                post: mapPost(oldData.post),
                parents: oldData.parents?.map(mapPost)
            };
        }

        if (Array.isArray(oldData)) return oldData.map(mapPost);
        if (oldData._id) return mapPost(oldData);

        return oldData;
    });
};

export function useMeQuery() {
    return useQuery({
        queryKey: [AUTH_KEY],
        queryFn: fetchMe,
        staleTime: CACHE_CONFIG.AUTH,
        retry: false
    });
}

export function useRegisterUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerRequest,
        onSuccess: async () => {
            queryClient.removeQueries();
            await queryClient.invalidateQueries({ queryKey: [AUTH_KEY] });
        }
    });
}

export function useLoginUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginRequest,
        onSuccess: async () => {
            queryClient.removeQueries();
            await queryClient.invalidateQueries({ queryKey: [AUTH_KEY] });
        }
    });
}

export function useLogoutUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: async () => {
            queryClient.removeQueries();
        }
    });
}

export function useUserByNameOrId(userIdentifier, params = {}) {
    const id = typeof userIdentifier === "object"
        ? userIdentifier?._id || userIdentifier?.username
        : userIdentifier;

    return useQuery({
        queryKey: [USERS_ROOT_KEY, id, params],
        queryFn: () => fetchUserByNameOrId(id, params),
        staleTime: CACHE_CONFIG.PROFILE,
        enabled: !!id,
        suspense: true
    });
}

export function useInfinitePosts({ currentUserId, ...params } = {}) {
    return useInfiniteQuery({
        queryKey: [POSTS_ROOT_KEY, QUERY_KEYS.FEED, params],
        queryFn: ({ pageParam = 0 }) => fetchPosts({ ...params, cursor: pageParam, currentUserId }),
        getNextPageParam: (last) => last.nextCursor
    });
}

export function usePostById(id, params = {}) {
    const { userLoading } = useGlobalContext();

    return useQuery({
        queryKey: [POSTS_ROOT_KEY, id, params],
        queryFn: () => fetchPostById(id, params),
        enabled: !userLoading && !!id
    });
}

export function useTrendingPosts(params = {}) {
    return useQuery({
        queryKey: [POSTS_ROOT_KEY, QUERY_KEYS.TRENDING, params],
        queryFn: () => fetchTrendingPosts(params),
        staleTime: CACHE_CONFIG.DEFAULT,
        suspense: true
    });
}

export function useInfiniteReplies({ postId, params = {} }) {
    return useInfiniteQuery({
        queryKey: [POSTS_ROOT_KEY, QUERY_KEYS.REPLIES, postId, params],
        queryFn: ({ pageParam = 0 }) => fetchReplies(postId, { ...params, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: CACHE_CONFIG.DEFAULT
    });
}

export function useInfiniteUserItems({ user, type = "posts", params = {} }) {
    const USER_ITEMS_API_MAP = {
        posts: fetchUserPosted,
        replies: fetchUserReplied,
        saves: fetchUserSaved,
        likes: fetchUserLiked
    };
    const fetchFn = USER_ITEMS_API_MAP[type];
    const userId = typeof user === "object" ? user?._id : user;

    return useInfiniteQuery({
        queryKey: [POSTS_ROOT_KEY, QUERY_KEYS.USER_ITEMS, type, String(userId), params],
        queryFn: ({ pageParam = 0 }) => fetchFn(userId, { ...params, cursor: pageParam }),
        getNextPageParam: (last) => last.nextCursor,
        enabled: !!userId
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();
    const { currentUser } = useGlobalContext();

    return useMutation({
        mutationFn: createPost,
        onMutate: async (newPost) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY, QUERY_KEYS.FEED] });
            const optimistic = {
                ...newPost,
                _id: `temp-${Date.now()}`,
                createdAt: new Date().toISOString(),
                userState: { liked: false, saved: false },
                likeCount: 0, replyCount: 0, repostCount: 0,
                author: { ...currentUser }
            };
            queryClient.setQueriesData({ queryKey: [POSTS_ROOT_KEY, QUERY_KEYS.FEED], exact: false }, (old) => {
                if (!old?.pages) return old;

                const nextPages = [...old.pages];
                const key = Object.keys(nextPages[0]).find(k => Array.isArray(nextPages[0][k]));

                nextPages[0] = { ...nextPages[0], [key]: [optimistic, ...nextPages[0][key]] };

                return { ...old, pages: nextPages };
            });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [POSTS_ROOT_KEY] })
    });
}

export function useEditPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, ...postData }) => editPost(postId, postData),
        onMutate: async ({ postId, ...postData }) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY], exact: false });
            const previousData = queryClient.getQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false });

            updatePostInCache(queryClient, postId, (post) => ({ ...post, ...postData }));

            return { previousData };
        },
        onError: (_, __, context) => {
            context?.previousData?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [POSTS_ROOT_KEY], exact: false })
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePost,
        onSettled: () => queryClient.invalidateQueries({ queryKey: [POSTS_ROOT_KEY] })
    });
}

export function useToggleLike(currentUserId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, action }) => toggleLike(postId, currentUserId, action),
        onMutate: async ({ postId, action }) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY] });
            const prev = queryClient.getQueriesData({ queryKey: [POSTS_ROOT_KEY] });

            updatePostInCache(queryClient, postId, (post) => ({
                ...post,
                likeCount: Math.max(0, post.likeCount + (action === ACTION_TYPES.LIKE ? 1 : -1)),
                userState: { ...post.userState, liked: action === ACTION_TYPES.LIKE }
            }));

            return { prev };
        },
        onError: (_, __, ctx) => ctx?.prev?.forEach(([k, d]) => queryClient.setQueryData(k, d)),
        onSettled: () => queryClient.invalidateQueries({ queryKey: [POSTS_ROOT_KEY, QUERY_KEYS.TRENDING] })
    });
}

export function useToggleSave(currentUserId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, action }) => toggleSave(postId, currentUserId, action),
        onMutate: async ({ postId, action }) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY] });
            const prev = queryClient.getQueriesData({ queryKey: [POSTS_ROOT_KEY] });

            updatePostInCache(queryClient, postId, (post) => ({
                ...post,
                userState: { ...post.userState, saved: action === ACTION_TYPES.SAVE }
            }));

            return { prev };
        },
        onError: (_, __, ctx) => ctx?.prev?.forEach(([k, d]) => queryClient.setQueryData(k, d))
    });
}
