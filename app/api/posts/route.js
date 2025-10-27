import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import User from "@/models/User";

/**
 * GET /api/posts?cursor=...&limit=20
 */
export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 2000;
        const onlyOriginal = searchParams.get("onlyOriginal") === "true";
        const cursor = searchParams.get("cursor");
        const author = searchParams.get("author");

        const filter = {};

        if (cursor) {
            filter._id = { $lt: cursor };
        }

        if (onlyOriginal) {
            filter.type = "original";
        }

        if (author) {
            filter.author = author;
        }

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit);

        return new Response(JSON.stringify({ posts }), {
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

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { userId, content, media, parentId = null } = body;

        if (!userId || !content) {
            return new Response(JSON.stringify({ error: "userId and content are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const user = await User.findById(userId).select("_id username displayName avatarInitials");
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        let type = "original";
        let parentPost = null;
        let rootPost = null;

        if (parentId) {
            const parent = await Post.findById(parentId);
            if (!parent) {
                return new Response(JSON.stringify({ error: "Parent post not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }

            type = "reply";
            parentPost = parentId;
            rootPost = parent.rootPost ? parent.rootPost : parentId;
        }

        const newPost = await Post.create({
            author: user._id,
            authorSnapshot: {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                avatarInitials: user.avatarInitials
            },
            content,
            media: media || [],
            type,
            parentPost,
            rootPost
        });

        if (parentId) {
            await Post.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } });
        }

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
