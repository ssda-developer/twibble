import { addUserStateToPosts } from "@/features/utils";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import User from "@/models/User";
import mongoose from "mongoose";

/**
 * GET /api/users/:id/posts?cursor=...&limit=20
 */
export async function GET(req, { params }) {
    try {
        await dbConnect();

        let userId;
        const { user } = await params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 20;
        const cursor = searchParams.get("cursor");
        const onlyOriginal = searchParams.get("onlyOriginal") === "true";
        const includeReposts = searchParams.get("includeReposts") === "true";
        const currentUserId = searchParams.get("currentUserId");

        if (mongoose.Types.ObjectId.isValid(user)) {
            userId = user;
        } else {
            const found = await User.findOne({ username: user }).select("_id").lean();
            userId = found._id.toString();
        }

        const filter = { author: userId };

        if (onlyOriginal) {
            filter.type = "original";
        }

        if (includeReposts) {
            filter.type = { $in: ["original", "repost"] };
        }

        if (cursor) {
            filter._id = { $lt: cursor };
        }

        let posts = await Post.find(filter)
            .sort({ _id: -1 })
            .limit(limit)
            .populate({
                path: "repostedPost",
                select: "_id author content media type",
                populate: {
                    path: "author",
                    select: "_id username displayName avatar"
                }
            })
            .populate({
                path: "author",
                select: "_id username displayName avatar"
            })
            .lean();

        let postsWithState = posts;

        if (currentUserId) {
            postsWithState = await addUserStateToPosts(posts, currentUserId);
        }

        const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null;

        return new Response(JSON.stringify({ posts: postsWithState, nextCursor }), {
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
