import { DEFAULT_PAGE_SIZE } from "@/constants";
import { addUserStateToPosts } from "@/features/utils";
import dbConnect from "@/lib/mongoose";
import Like from "@/models/Like";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        let userId;
        const { user } = await params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
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

        const likes = await Like.find(filter)
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

        const posts = likes
            .map((s) => s.post)
            .filter(Boolean);

        if (posts.length === 0) {
            return new Response(JSON.stringify({ likes: [], nextCursor: null }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        let postsWithState = posts;

        if (currentUserId) {
            postsWithState = await addUserStateToPosts(posts, currentUserId);
        }

        const nextCursor = likes.length === limit ? likes[likes.length - 1]._id : null;

        return new Response(
            JSON.stringify({ likes: postsWithState, nextCursor }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.error("Failed to fetch user liked posts:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch user liked posts" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
