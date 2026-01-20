"use client";

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
    fetchUserLikes,
    fetchUserPosts,
    fetchUserReplies,
    fetchUserSaves,
    loginRequest,
    logoutRequest,
    registerRequest,
    toggleLike,
    toggleSave
} from "./api";

const POSTS_ROOT_KEY = "posts_root";
const CACHE_STALE_TIME = 30_000;

const USER_ITEMS_API_MAP = {
    posts: fetchUserPosts,
    replies: fetchUserReplies,
    saves: fetchUserSaves,
    likes: fetchUserLikes
};

const updateCachedPost = (queryClient, targetPostId, updateFn) => {
    const targetIdString = String(targetPostId);

    queryClient.setQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false }, (cachedData) => {
        if (!cachedData) return cachedData;

        if (cachedData.pages) {
            return {
                ...cachedData,
                pages: cachedData.pages.map((page) => {
                    const listKey = Object.keys(page).find((key) => Array.isArray(page[key]));
                    if (!listKey) return page;

                    return {
                        ...page,
                        [listKey]: page[listKey].map((post) =>
                            String(post._id) === targetIdString ? updateFn(post) : post
                        )
                    };
                })
            };
        }

        if (cachedData.post || cachedData.parents) {
            let hasUpdates = false;
            const nextData = { ...cachedData };

            if (nextData.post && String(nextData.post._id) === targetIdString) {
                nextData.post = updateFn(nextData.post);
                hasUpdates = true;
            }

            if (Array.isArray(nextData.parents)) {
                const nextParents = nextData.parents.map((parent) => {
                    if (String(parent._id) === targetIdString) {
                        hasUpdates = true;
                        return updateFn(parent);
                    }
                    return parent;
                });
                if (hasUpdates) nextData.parents = nextParents;
            }

            return hasUpdates ? nextData : cachedData;
        }

        if (Array.isArray(cachedData)) {
            return cachedData.map((post) =>
                String(post._id) === targetIdString ? updateFn(post) : post
            );
        }

        if (cachedData._id && String(cachedData._id) === targetIdString) {
            return updateFn(cachedData);
        }

        return cachedData;
    });
};

export function useLoginUser() {
    const queryClient = useQueryClient();
    const { setCurrentUser, setUserFetchStatus } = useGlobalContext();

    return useMutation({
        mutationFn: loginRequest,
        onMutate: () => setUserFetchStatus("idle"),
        onSuccess: async (response) => {
            setCurrentUser(response.user);
            setUserFetchStatus(response?.user ? "found" : "not_found");
            await queryClient.invalidateQueries({ predicate: () => true });
        }
    });
}

export function useRegisterUser() {
    const { setCurrentUser } = useGlobalContext();
    return useMutation({
        mutationFn: registerRequest,
        onSuccess: (response) => setCurrentUser(response.user)
    });
}

export function useLogoutUser() {
    const { setCurrentUser } = useGlobalContext();
    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => setCurrentUser(null)
    });
}

export function useMeQuery() {
    return useQuery({
        queryKey: ["auth_me"],
        queryFn: fetchMe,
        staleTime: 5 * 60 * 1000,
        retry: false
    });
}

export function useUserByNameOrId(userIdentifier, params = {}) {
    const id = typeof userIdentifier === "object"
        ? userIdentifier?._id || userIdentifier?.username
        : userIdentifier;

    return useQuery({
        queryKey: ["users_root", id, params],
        queryFn: () => fetchUserByNameOrId(id, params),
        staleTime: CACHE_STALE_TIME,
        enabled: !!id,
        suspense: true
    });
}

export function useInfinitePosts({ currentUserId, ...params } = {}) {
    return useInfiniteQuery({
        queryKey: [POSTS_ROOT_KEY, "feed", params],
        queryFn: ({ pageParam = 0 }) => fetchPosts({ ...params, cursor: pageParam, currentUserId }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: CACHE_STALE_TIME
    });
}

export function usePostById(id, params = {}) {
    const { userFetchStatus } = useGlobalContext();
    return useQuery({
        queryKey: [POSTS_ROOT_KEY, id],
        queryFn: () => fetchPostById(id, { ...params, userFetchStatus }),
        staleTime: 5 * 60 * 1000,
        enabled: userFetchStatus !== "idle"
    });
}

export function useToggleLike(currentUserId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, action }) => toggleLike(postId, currentUserId, action),
        onMutate: async ({ postId }) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY], exact: false });
            const previousData = queryClient.getQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false });

            updateCachedPost(queryClient, postId, (post) => ({
                ...post,
                userState: { ...post.userState, liked: !post.userState.liked },
                likeCount: post.likeCount + (post.userState.liked ? -1 : 1)
            }));

            return { previousData };
        },
        onError: (_, __, context) => {
            context?.previousData?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [POSTS_ROOT_KEY, "trending"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: [POSTS_ROOT_KEY, "user_items", "likes"]
            });
        }
    });
}

export function useToggleSave(currentUserId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, action }) => toggleSave(postId, currentUserId, action),
        onMutate: async ({ postId, action }) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY], exact: false });
            const previousData = queryClient.getQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false });

            updateCachedPost(queryClient, postId, (post) => ({
                ...post,
                userState: {
                    ...post.userState,
                    saved: action === "save"
                }
            }));

            return { previousData };
        },
        onError: (_, __, context) => {
            context?.previousData?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [POSTS_ROOT_KEY, "user_items", "saves"],
                exact: false
            });
        }
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPost,
        onMutate: async (newPostPayload) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY], exact: false });
            const previousData = queryClient.getQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false });

            const optimisticPost = {
                ...newPostPayload,
                _id: `temp-${Date.now()}`,
                createdAt: new Date().toISOString(),
                userState: { liked: false, saved: false },
                likeCount: 0,
                replyCount: 0,
                repostCount: 0,
                author: {}
            };

            queryClient.setQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false }, (cachedData) => {
                if (!cachedData?.pages) return cachedData;

                return {
                    ...cachedData,
                    pages: cachedData.pages.map((page, index) => {
                        if (index !== 0) return page;

                        const listKey = Object.keys(page).find((key) => Array.isArray(page[key]));
                        if (!listKey) return page;

                        return {
                            ...page,
                            [listKey]: [optimisticPost, ...page[listKey]]
                        };
                    })
                };
            });

            return { previousData };
        },
        onError: (_, __, context) => {
            context?.previousData?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [POSTS_ROOT_KEY], exact: false })
    });
}

export function useEditPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, ...postData }) => editPost(postId, postData),
        onMutate: async ({ postId, ...postData }) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY], exact: false });
            const previousData = queryClient.getQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false });

            updateCachedPost(queryClient, postId, (post) => ({ ...post, ...postData }));

            return { previousData };
        },
        onError: (_, __, context) => {
            context?.previousData?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [POSTS_ROOT_KEY], exact: false });
        }
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePost,
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: [POSTS_ROOT_KEY], exact: false });
            const previousData = queryClient.getQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false });
            const targetIdString = String(postId);

            queryClient.setQueriesData({ queryKey: [POSTS_ROOT_KEY], exact: false }, (cachedData) => {
                if (!cachedData) return cachedData;

                if (cachedData.pages) {
                    return {
                        ...cachedData,
                        pages: cachedData.pages.map((page) => {
                            const listKey = Object.keys(page).find((key) => Array.isArray(page[key]));
                            return listKey ? {
                                ...page,
                                [listKey]: page[listKey].filter((post) => String(post._id) !== targetIdString)
                            } : page;
                        })
                    };
                }

                if (cachedData.post) {
                    if (String(cachedData.post._id) === targetIdString) return null;
                    return {
                        ...cachedData,
                        parents: cachedData.parents?.filter((parent) => String(parent._id) !== targetIdString)
                    };
                }

                if (Array.isArray(cachedData)) {
                    return cachedData.filter((post) => String(post._id) !== targetIdString);
                }

                return cachedData;
            });

            return { previousData };
        },
        onError: (_, __, context) => {
            context?.previousData?.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [POSTS_ROOT_KEY], exact: false })
    });
}

export function useTrendingPosts(params = {}) {
    return useQuery({
        queryKey: [POSTS_ROOT_KEY, "trending", params],
        queryFn: () => fetchTrendingPosts(params),
        staleTime: CACHE_STALE_TIME,
        suspense: true
    });
}

export function useInfiniteReplies({ postId, params = {} }) {
    return useInfiniteQuery({
        queryKey: [POSTS_ROOT_KEY, "replies", postId, params],
        queryFn: ({ pageParam = 0 }) => fetchReplies(postId, { ...params, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: CACHE_STALE_TIME
    });
}

export function useInfiniteUserItems({ user, type = "posts", params = {} }) {
    const fetchFn = USER_ITEMS_API_MAP[type] || fetchUserPosts;
    const userId = typeof user === "object" ? user?._id : user;

    return useInfiniteQuery({
        queryKey: [POSTS_ROOT_KEY, "user_items", type, userId, params],
        queryFn: ({ pageParam = 0 }) => fetchFn(userId, { ...params, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: CACHE_STALE_TIME,
        enabled: !!userId
    });
}
