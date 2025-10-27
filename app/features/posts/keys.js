export const postsKeys = {
    all: ["posts"],
    list: (params) => ["posts", { ...params }],
    byId: (id) => ["posts", "detail", id],
    replies: (postId, params = {}) => ["posts", "detail", postId, "replies", { ...params }],
    userPosts: (userId, params = {}) => ["posts", userId, { ...params }]
};
