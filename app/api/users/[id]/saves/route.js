import { addUserStateToPosts } from "@/app/features/posts/utils";
import dbConnect from "@/lib/mongoose";
import Save from "@/models/Save";

/**
 * GET /api/users/:id/saves?cursor=...&limit=20
 */
export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id: userId } = params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 20;
        const cursor = searchParams.get("cursor");

        const filter = { user: userId };
        if (cursor) {
            filter._id = { $lt: cursor };
        }

        const saves = await Save.find(filter)
            .populate({
                path: "post",
                match: { deleted: false },
                options: { sort: { _id: -1 } }
            })
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        const posts = saves
            .map((s) => s.post)
            .filter(Boolean);

        if (posts.length === 0) {
            return new Response(JSON.stringify({ saves: [], nextCursor: null }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const postsWithState = await addUserStateToPosts(posts, userId);

        const nextCursor = saves.length === limit ? saves[saves.length - 1]._id : null;

        return new Response(
            JSON.stringify({ saves: postsWithState, nextCursor }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.error("Failed to fetch user saves:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch user saves" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
