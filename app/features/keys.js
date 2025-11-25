export const POSTS_STALE_TIME = 30_000;

export const postsKeys = {
    all: ["posts"],

    lists: {
        all: ["posts", "list"],
        infinite: (params = {}) => ["posts", "list", "infinite", params],
        byUser: (userId, params = {}) => ["posts", "user", userId, params],
        infiniteByUser: (userId, params = {}) => ["posts", "user", userId, "infinite", params],
        byId: (id, currentUserId) => ["posts", "detail", id, currentUserId],
        replies: (postId, params = {}) => ["posts", "detail", postId, "replies", params],
        infiniteReplies: (postId, params = {}) => ["posts", "detail", postId, "replies", "infinite", params],
        delete: (id) => ["posts", "delete", id]
    }
};
