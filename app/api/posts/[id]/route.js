import { addUserStateToPosts } from "@/app/features/posts/utils";
import dbConnect from "@/lib/mongoose";
import Like from "@/models/Like";
import Post from "@/models/Post";
import Save from "@/models/Save";

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

export async function DELETE(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const deleted = await Post.findByIdAndDelete(id);

        if (!deleted) {
            return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
        }

        await Promise.all([
            Like.deleteMany({ post: deleted._id }),
            Save.deleteMany({ post: deleted._id })
        ]);

        return new Response(JSON.stringify({ ok: true, id: deleted._id }), { status: 200 });
    } catch (error) {
        console.error("Failed to delete post:", error);
        return new Response(JSON.stringify({ error: "Failed to delete post" }), { status: 500 });
    }
}
