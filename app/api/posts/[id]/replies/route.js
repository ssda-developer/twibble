import { addUserStateToPosts } from "@/features/utils";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import mongoose from "mongoose";

/**
 * GET /api/posts/:id/replies?cursor=...&limit=20&currentUserId=...
 */
export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(req.url);

        const limit = parseInt(searchParams.get("limit")) || 20;
        const cursor = searchParams.get("cursor");
        const currentUserId = searchParams.get("currentUserId");

        const filter = { parentPost: id };

        if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
            filter._id = { $lt: cursor };
        }

        let replies = await Post.find(filter)
            .sort({ _id: -1 })
            .limit(limit)
            .populate({
                path: "author",
                select: "_id username displayName avatar"
            })
            .lean();

        let postsWithState = replies;

        if (currentUserId) {
            postsWithState = await addUserStateToPosts(replies, currentUserId);
        }

        const nextCursor =
            replies.length > 0 ? replies[replies.length - 1]._id : null;

        return new Response(
            JSON.stringify({
                replies: postsWithState,
                nextCursor
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.error("Failed to fetch replies:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch replies" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
