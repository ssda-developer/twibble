import { POST_TYPES } from "@/constants/post-types";
import dbConnect from "@/lib/mongoose";
import Like from "@/models/Like";
import Post from "@/models/Post";

export async function GET() {
    try {
        await dbConnect();

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const topLikedData = await Like.aggregate([
            { $match: { createdAt: { $gte: since } } },
            { $group: { _id: "$post", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        if (!topLikedData.length) {
            return new Response(JSON.stringify({ posts: [] }), { status: 200 });
        }

        const posts = await Post.find({
            _id: { $in: topLikedData.map(item => item._id) },
            type: { $in: [POST_TYPES.ORIGINAL, POST_TYPES.REPOST] }
        })
            .populate("author", "_id username displayName avatar")
            .populate({
                path: "repostedPost",
                populate: { path: "author", select: "_id username displayName avatar" }
            })
            .lean();

        const trendingPosts = posts
            .map(post => {
                const likeInfo = topLikedData.find(l => String(l._id) === String(post._id));
                return {
                    ...post,
                    recentLikeCount: likeInfo ? likeInfo.count : 0
                };
            })
            .sort((a, b) => b.recentLikeCount - a.recentLikeCount)
            .slice(0, 5);

        return new Response(JSON.stringify({ posts: trendingPosts }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("[Trending Error]:", error);
        return new Response(JSON.stringify({ posts: [] }), { status: 500 });
    }
}
