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
    const { userFetchStatus } = useGlobalContext();

    return useQuery({
        queryKey: postsKeys.lists.byId(id),
        queryFn: () => fetchPostById(id, { ...params, userFetchStatus }),
        staleTime: POSTS_STALE_TIME,
        suspense: true,
        enabled: userFetchStatus !== "idle"
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

export function useInfiniteReplies({ postId, params = {} }) {
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

export function useToggleLike(currentUserId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["like"],
        mutationFn: ({ postId, action }) =>
            toggleLike(postId, currentUserId, action),

        async onMutate({ postId, action }) {
            const updatePost = (p) =>
                p._id === postId
                    ? {
                        ...p,
                        userState: { ...p.userState, liked: action === "like" },
                        likeCount:
                            action === "like" ? p.likeCount + 1 : Math.max(0, p.likeCount - 1)
                    }
                    : p;

            await queryClient.cancelQueries(postsKeys.lists.byId(postId));
            const previousPost = queryClient.getQueryData(postsKeys.lists.byId(postId));
            if (previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(postId), updatePost);
            }

            const queries = queryClient.getQueryCache().findAll({ queryKey: ["posts"] });
            queries.forEach((query) => {
                const old = query.state.data;
                if (!old) return;

                if (old.pages) {
                    const newPages = old.pages.map((page) => {
                        const updateArray = (key) =>
                            page[key]
                                ? { ...page, [key]: page[key].map(updatePost) }
                                : page;
                        page = updateArray("posts");
                        page = updateArray("replies");
                        return page;
                    });
                    queryClient.setQueryData(query.queryKey, { ...old, pages: newPages });
                    return;
                }

                if (old.post) {
                    const newPost = updatePost(old.post);
                    const newParents = old.parents ? old.parents.map(updatePost) : undefined;
                    queryClient.setQueryData(query.queryKey, { ...old, post: newPost, parents: newParents });
                }
            });

            return { previousPost, postId };
        },

        onError(_err, _vars, context) {
            if (context?.previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(context.postId), context.previousPost);
            }
        },

        async onSettled() {
            await queryClient.invalidateQueries({ queryKey: postsKeys.lists.trending({}) });
        }
    });
}

export function useToggleSave(currentUserId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["save"],
        mutationFn: ({ postId, action }) =>
            toggleSave(postId, currentUserId, action),

        async onMutate({ postId, action }) {
            const updatePost = (p) =>
                p._id === postId
                    ? {
                        ...p,
                        userState: { ...p.userState, saved: action === "save" }
                    }
                    : p;

            await queryClient.cancelQueries(postsKeys.lists.byId(postId));
            const previousPost = queryClient.getQueryData(postsKeys.lists.byId(postId));
            if (previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(postId), updatePost);
            }

            const queries = queryClient.getQueryCache().findAll({ queryKey: ["posts"] });
            queries.forEach((query) => {
                const old = query.state.data;
                if (!old) return;

                if (old.pages) {
                    const newPages = old.pages.map((page) => {
                        const updateArray = (key) =>
                            page[key]
                                ? { ...page, [key]: page[key].map(updatePost) }
                                : page;
                        page = updateArray("posts");
                        page = updateArray("replies");
                        return page;
                    });
                    queryClient.setQueryData(query.queryKey, { ...old, pages: newPages });
                    return;
                }

                if (old.post) {
                    const newPost = updatePost(old.post);
                    const newParents = old.parents ? old.parents.map(updatePost) : undefined;
                    queryClient.setQueryData(query.queryKey, { ...old, post: newPost, parents: newParents });
                }
            });

            return { previousPost, postId };
        },

        onError(_err, _vars, context) {
            if (context?.previousPost) {
                queryClient.setQueryData(postsKeys.lists.byId(context.postId), context.previousPost);
            }
        }
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPost,

        onMutate: async (newPost) => {
            await queryClient.cancelQueries(postsKeys.all);

            const prevData = queryClient.getQueryData(postsKeys.all);

            queryClient.setQueryData(postsKeys.all, (old = []) => [
                { ...newPost, _id: `optimistic-${Date.now()}` },
                ...old
            ]);

            return { prevData };
        },

        onError: (_err, _newPost, ctx) => {
            if (ctx?.prevData) {
                queryClient.setQueryData(postsKeys.all, ctx.prevData);
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries(postsKeys.all);
        }
    });
}

export function useRepostPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRepost,

        onMutate: async (newPost) => {
            await queryClient.cancelQueries(postsKeys.all);

            const prevData = queryClient.getQueryData(postsKeys.all);

            queryClient.setQueryData(postsKeys.all, (old = []) => [
                { ...newPost, _id: `optimistic-${Date.now()}` },
                ...old
            ]);

            return { prevData };
        },

        onError: (_err, _newPost, ctx) => {
            if (ctx?.prevData) {
                queryClient.setQueryData(postsKeys.all, ctx.prevData);
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries(postsKeys.all);
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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deletePost(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: postsKeys.all });

            const previous = queryClient.getQueryData(postsKeys.all) || [];

            queryClient.setQueryData(postsKeys.all, (old = []) =>
                Array.isArray(old) ? old.filter((p) => p._id !== id) : old
            );

            return { previous };
        },

        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(postsKeys.all, context.previous);
            }
            console.error("Delete failed", _err);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: postsKeys.all });
        }
    });
}

export function useLoginUser() {
    const queryClient = useQueryClient();
    const { setCurrentUser, setUserFetchStatus } = useGlobalContext();
    // setUserFetchStatus("idle");

    return useMutation({
        queryKey: ["login"],
        mutationFn: loginRequest,
        onMutate: () => {
            setUserFetchStatus("idle");
        },
        onSuccess: async (data) => {
            setCurrentUser(data.user);
            setUserFetchStatus(data?.user ? "found" : "not_found");

            await queryClient.invalidateQueries({
                predicate: () => true
            });
        }
    });
}

export function useRegisterUser() {
    const queryClient = useQueryClient();
    const { setCurrentUser } = useGlobalContext();

    return useMutation({
        mutationFn: registerRequest,
        onSuccess: async (data) => {
            setCurrentUser(data.user);

            await queryClient.invalidateQueries({
                predicate: () => true
            });
        }
    });
}

export function useLogoutUser() {
    const queryClient = useQueryClient();
    const { setCurrentUser } = useGlobalContext();

    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: async () => {
            setCurrentUser(null);

            await queryClient.invalidateQueries({
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
