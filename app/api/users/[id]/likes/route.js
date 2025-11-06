import { addUserStateToPosts } from "@/app/features/posts/utils";
import dbConnect from "@/lib/mongoose";
import Like from "@/models/Like";

/**
 * GET /api/users/:id/likes?cursor=...&limit=20
 */
export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 20;
        const cursor = searchParams.get("cursor");

        const filter = { user: id };

        if (cursor) {
            filter._id = { $lt: cursor };
        }

        const likes = await Like.find(filter)
            .populate({
                path: "post",
                options: { sort: { _id: -1 } }
            })
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        const posts = likes
            .map((s) => s.post)
            .filter(Boolean);

        if (posts.length === 0) {
            return new Response(JSON.stringify({ likes: [], nextCursor: null }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const postsWithState = await addUserStateToPosts(posts, id);

        const nextCursor = likes.length === limit ? likes[likes.length - 1]._id : null;

        return new Response(
            JSON.stringify({ likes: postsWithState, nextCursor }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.error("Failed to fetch user likes:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch user likes" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
