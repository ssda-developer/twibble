import { addUserStateToPosts } from "@/app/features/utils";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";

/**
 * GET /api/users/:id/replies?cursor=...&limit=20
 */
export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 20;
        const cursor = searchParams.get("cursor");

        const filter = { author: id, type: "reply" };

        if (cursor) {
            filter._id = { $lt: cursor };
        }

        let replies = await Post.find(filter)
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        const postsWithState = await addUserStateToPosts(replies, id);

        const nextCursor = replies.length > 0 ? replies[replies.length - 1]._id : null;

        return new Response(JSON.stringify({ replies: postsWithState, nextCursor }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Failed to fetch replies:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch replies" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
