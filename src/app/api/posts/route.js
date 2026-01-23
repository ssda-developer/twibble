import { DEFAULT_PAGE_SIZE } from "@/constants";
import { POST_TYPES } from "@/constants/post-types";
import { addUserStateToPosts } from "@/features/utils";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || DEFAULT_PAGE_SIZE;
        const onlyOriginal = searchParams.get("onlyOriginal") === "true";
        const includeReposts = searchParams.get("includeReposts") === "true";
        const cursor = searchParams.get("cursor");
        const author = searchParams.get("author");
        const currentUserId = searchParams.get("currentUserId");

        const filter = {};

        if (onlyOriginal) {
            filter.type = POST_TYPES.ORIGINAL;
        } else if (includeReposts) {
            filter.type = { $in: [POST_TYPES.ORIGINAL, POST_TYPES.REPOST] };
        }

        if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
            filter._id = { $lt: cursor };
        }

        if (author) {
            filter.author = author;
        }

        const posts = await Post.find(filter)
            .sort({ _id: -1 })
            .limit(limit + 1)
            .populate({
                path: "author",
                select: "_id username displayName avatar"
            })
            .populate({
                path: "repostedPost",
                select: "_id author content media type createdAt",
                populate: {
                    path: "author",
                    select: "_id username displayName avatar"
                }
            })
            .lean();

        let nextCursor = null;

        if (posts.length > limit) {
            const lastItem = posts.pop();
            nextCursor = lastItem._id.toString();
        }

        let postsWithState = posts;

        if (currentUserId && posts.length > 0) {
            postsWithState = await addUserStateToPosts(posts, currentUserId);
        }

        return new Response(
            JSON.stringify({ posts: postsWithState, nextCursor }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch posts" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { userId, content, media, parentId = null, repostId = null } = body;

        if (!userId || (!content && !parentId && !repostId)) {
            return new Response(
                JSON.stringify({ error: "userId and content/parentId/repostId are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = await User.findById(userId).select("_id username displayName avatar");

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        let type = POST_TYPES.ORIGINAL;
        let parentPost = null;
        let rootPost = null;
        let repostedPost = null;

        if (parentId) {
            const parent = await Post.findById(parentId);

            if (!parent) {
                return new Response(JSON.stringify({ error: "Parent not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }

            type = POST_TYPES.REPLY;
            parentPost = parentId;
            rootPost = parent.rootPost || parentId;

            await Post.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } });
        }

        if (repostId) {
            const repost = await Post.findById(repostId);
            if (!repost) {
                return new Response(JSON.stringify({ error: "Post to repost not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }

            type = POST_TYPES.REPOST;
            repostedPost = repost._id;
            rootPost = repost.rootPost || repost._id;

            await Post.findByIdAndUpdate(repost._id, { $inc: { repostCount: 1 } });
        }

        const newPost = await Post.create({
            author: user._id,
            content: content || null,
            media: media || [],
            type,
            parentPost,
            rootPost,
            repostedPost
        });

        return new Response(JSON.stringify({ post: newPost }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Failed to create post:", error);
        return new Response(JSON.stringify({ error: "Failed to create post" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
