import Like from "@/models/Like";
import Post from "@/models/Post";
import Save from "@/models/Save";

export async function addUserStateToPosts(posts, currentUserId) {
    if (!currentUserId) return posts;

    const postIds = Array.isArray(posts) ? posts.map(p => p._id) : [posts._id];

    const likedPosts = await Like.find({
        user: currentUserId,
        post: { $in: postIds }
    }).select("post").lean();

    const savedPosts = await Save.find({
        user: currentUserId,
        post: { $in: postIds }
    }).select("post").lean();

    const reposts = await Post.find({
        type: "repost",
        repostedPost: { $in: postIds },
        author: currentUserId
    }).select("repostedPost").lean();

    const replies = await Post.find({
        type: "reply",
        parentPost: { $in: postIds },
        author: currentUserId
    }).select("parentPost").lean();

    const likedIds = new Set(likedPosts.map(l => l.post.toString()));
    const savedIds = new Set(savedPosts.map(l => l.post.toString()));
    const repostedIds = new Set(reposts.map(r => r.repostedPost.toString()));
    const repliedIds = new Set(replies.map(r => r.parentPost.toString()));

    const addState = (post) => ({
        ...post,
        userState: {
            liked: likedIds.has(post._id.toString()),
            saved: savedIds.has(post._id.toString()),
            reposted: repostedIds.has(post._id.toString()),
            replied: repliedIds.has(post._id.toString())
        }
    });

    if (Array.isArray(posts)) {
        return posts.map(addState);
    } else {
        return addState(posts);
    }
}
