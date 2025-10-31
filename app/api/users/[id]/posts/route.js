import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";

/**
 * GET /api/users/:id/posts?cursor=...&limit=20
 */
export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 20;
        const cursor = searchParams.get("cursor");

        const filter = { author: id, type: "original" };

        if (cursor) {
            filter._id = { $lt: cursor };
        }

        let posts = await Post.find(filter)
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null;

        return new Response(JSON.stringify({ posts, nextCursor }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
