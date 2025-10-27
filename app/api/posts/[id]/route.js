import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const post = await Post.findById(id);

        if (!post) {
            return new Response(JSON.stringify({ error: "Post not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ post }), {
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
