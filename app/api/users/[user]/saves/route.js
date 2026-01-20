import { addUserStateToPosts } from "@/features/utils";
import dbConnect from "@/lib/mongoose";
import Save from "@/models/Save";
import User from "@/models/User";
import mongoose from "mongoose";

/**
 * GET /api/users/:user/saves?cursor=...&limit=20
 */
export async function GET(req, { params }) {
    try {
        await dbConnect();

        let userId;
        const { user } = await params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 20;
        const cursor = searchParams.get("cursor");
        const currentUserId = searchParams.get("currentUserId");

        if (mongoose.Types.ObjectId.isValid(user)) {
            userId = user;
        } else {
            const found = await User.findOne({ username: user }).select("_id").lean();
            userId = found._id.toString();
        }

        const filter = { user: userId };

        if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
            filter._id = { $lt: cursor };
        }

        const saves = await Save.find(filter)
            .sort({ _id: -1 })
            .limit(limit)
            .populate({
                path: "post",
                options: { sort: { _id: -1 } },
                populate: [
                    {
                        path: "author",
                        select: "_id username displayName avatar"
                    },
                    {
                        path: "repostedPost",
                        select: "_id author content media type",
                        populate: {
                            path: "author",
                            select: "_id username displayName avatar"
                        }
                    }
                ]
            })
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

        let postsWithState = posts;

        if (currentUserId) {
            postsWithState = await addUserStateToPosts(posts, currentUserId);
        }

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
