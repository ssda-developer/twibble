import Like from "@/models/Like";

export async function addUserStateToPosts(posts, currentUserId) {
    if (!currentUserId) return posts;

    const postIds = Array.isArray(posts) ? posts.map(p => p._id) : [posts._id];

    const likedPosts = await Like.find({
        user: currentUserId,
        post: { $in: postIds }
    }).select("post").lean();

    const likedIds = new Set(likedPosts.map(l => l.post.toString()));

    const addState = (post) => ({
        ...post,
        userState: {
            liked: likedIds.has(post._id.toString())
        }
    });

    if (Array.isArray(posts)) {
        return posts.map(addState);
    } else {
        return addState(posts);
    }
}
