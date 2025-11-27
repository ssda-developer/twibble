import dbConnect from "@/lib/mongoose";
import Like from "@/models/Like";
import Post from "@/models/Post";

export async function GET() {
    try {
        await dbConnect();

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const aggregated = await Like.aggregate([
            {
                $match: {
                    createdAt: { $gte: since }
                }
            },
            {
                $group: {
                    _id: "$post",
                    likeCount: { $sum: 1 }
                }
            },
            {
                $sort: { likeCount: -1, _id: 1 }
            },
            { $limit: 6 }
        ]);

        const postIds = aggregated.map(item => item._id);

        if (!postIds.length) {
            return new Response(JSON.stringify({ posts: [] }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const posts = await Post.find({ _id: { $in: postIds }, type: "original" }).populate({
            path: "author",
            select: "_id username displayName avatar"
        }).lean();
        const postsById = new Map(posts.map(post => [String(post._id), post]));

        const trendingPosts = aggregated
            .map(item => {
                const post = postsById.get(String(item._id));
                if (!post) return null;

                return {
                    ...post,
                    recentLikeCount: item.likeCount
                };
            })
            .filter(Boolean);

        return new Response(JSON.stringify({ posts: trendingPosts }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("[GET /api/trending] Error:", error);

        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
