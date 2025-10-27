import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, fetchPostById, fetchPosts, fetchReplies, fetchUserPosts } from "./api";
import { postsKeys } from "./keys";

export function usePosts(params) {
    return useQuery({
        queryKey: postsKeys.list(params),
        queryFn: () => fetchPosts(params),
        staleTime: 30_000,
        suspense: true
    });
}

export function useUserPosts(params) {
    return useQuery({
        queryKey: postsKeys.userPosts(params),
        queryFn: () => fetchUserPosts(params),
        staleTime: 30_000,
        suspense: true
    });
}

export function usePostById(id) {
    return useQuery({
        queryKey: postsKeys.byId(id),
        queryFn: () => fetchPostById(id),
        staleTime: 30_000,
        suspense: true
    });
}

export function useReplies(postId, params = {}) {
    return useQuery({
        queryKey: postsKeys.replies(postId, params),
        queryFn: () => fetchReplies(postId, params),
        staleTime: 30_000,
        suspense: true
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

        onSuccess: (createdPost) => {
            qc.invalidateQueries(postsKeys.all);
        }
    });
}
