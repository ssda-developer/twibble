import { useGlobalContext } from "@/context/GlobalContext";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createPost,
    createRepost,
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
import { POSTS_STALE_TIME, postsKeys } from "./keys";

export function useUserByNameOrId(user, params = {}) {
    return useQuery({
        queryKey: postsKeys.users.byNameOrId(user),
        queryFn: () => fetchUserByNameOrId(user, params),
        staleTime: POSTS_STALE_TIME,
        suspense: true
    });
}

export function useTrendingPosts(params = {}) {
    return useQuery({
        queryKey: postsKeys.lists.trending(params),
        queryFn: () => fetchTrendingPosts(params),
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

export function useInfiniteUserItems({ user, type = "posts", params = {} }) {
    const map = {
        posts: {
            fetchFn: fetchUserPosts,
            keyFn: (u, p) => postsKeys.lists.infiniteByUser(u, p)
        },
        replies: {
            fetchFn: fetchUserReplies,
            keyFn: (u, p) => postsKeys.lists.infiniteByUser(u, { ...p, type: "replies" })
        },
        saves: {
            fetchFn: fetchUserSaves,
            keyFn: (u, p) => postsKeys.lists.infiniteByUser(u, { ...p, type: "saves" })
        },
        likes: {
            fetchFn: fetchUserLikes,
            keyFn: (u, p) => postsKeys.lists.infiniteByUser(u, { ...p, type: "likes" })
        }
    };

    const conf = map[type] ?? map.posts;

    return useInfiniteQuery({
        queryKey: conf.keyFn(user, params),
        queryFn: ({ pageParam }) => conf.fetchFn(user, { ...params, cursor: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: POSTS_STALE_TIME,
        suspense: true
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

            return { previousPost, postId };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousPost && context?.postId) {
                queryClient.setQueryData(postsKeys.lists.byId(context.postId), context.previousPost);
            }
        },

        onSuccess: () => {
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

            return { previousPost, postId };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousPost && context?.postId) {
                queryClient.setQueryData(postsKeys.lists.byId(context.postId), context.previousPost);
            }
        },

        onSuccess: () => {
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

export function useRepostPost() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createRepost,

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

export function useEditPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content }) => editPost(postId, content),

        onMutate: async ({ postId, content }) => {
            await queryClient.cancelQueries(postsKeys.lists.byId(postId));

            const previousPost = queryClient.getQueryData(postsKeys.lists.byId(postId));

            if (previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(postId), old => ({
                    ...old,
                    content
                }));
            }

            return { previousPost };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(context.previousPost._id), context.previousPost);
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === "posts" });
        }
    });
}

export function useDeletePost() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id) => deletePost(id),

        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: postsKeys.all });

            const previous = qc.getQueryData(postsKeys.all) || [];

            qc.setQueryData(postsKeys.all, (old = []) =>
                Array.isArray(old) ? old.filter((p) => p._id !== id) : old
            );

            return { previous };
        },

        onError: (_err, _id, context) => {
            if (context?.previous) {
                qc.setQueryData(postsKeys.all, context.previous);
            }
            console.error("Delete failed", _err);
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: postsKeys.all });
        }
    });
}

export function useLoginUser() {
    const qc = useQueryClient();
    const { setCurrentUser } = useGlobalContext();

    return useMutation({
        mutationFn: loginRequest,
        onSuccess: async (data) => {
            setCurrentUser(data.user);

            await qc.invalidateQueries(postsKeys.all);
        }
    });
}

export function useRegisterUser() {
    const qc = useQueryClient();
    const { setCurrentUser } = useGlobalContext();

    return useMutation({
        mutationFn: registerRequest,
        onSuccess: async (data) => {
            setCurrentUser(data.user);

            await qc.invalidateQueries(postsKeys.all);
        }
    });
}

export function useLogoutUser() {
    const qc = useQueryClient();
    const { setCurrentUser } = useGlobalContext();

    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: async () => {
            setCurrentUser(null);

            await qc.invalidateQueries({
                predicate: (query) => {
                    const key = query.queryKey;
                    if (!Array.isArray(key)) return false;
                    return key[0] === "posts";
                }
            });
        }
    });
}

export function useMeQuery() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: fetchMe,
        staleTime: 5 * 60 * 1000,
        retry: false
    });
}
