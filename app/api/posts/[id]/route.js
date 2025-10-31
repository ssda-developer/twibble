import { addUserStateToPosts } from "@/app/features/posts/utils";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const currentUserId = searchParams.get("currentUserId");

        const post = await Post.findById(id).lean();

        if (!post) {
            return new Response(JSON.stringify({ error: "Post not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        const postWithState = await addUserStateToPosts(post, currentUserId);

        return new Response(JSON.stringify({ post: postWithState }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Failed to fetch post:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch post" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
