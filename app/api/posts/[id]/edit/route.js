import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import mongoose from "mongoose";

/**
 * PATCH /api/posts/:id/edit
 * body: { content: string }
 */
export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { content } = await req.json();

        const session = await mongoose.startSession();

        let updatedPost;
        try {
            await session.withTransaction(async () => {
                updatedPost = await Post.findByIdAndUpdate(
                    id,
                    { content },
                    { new: true, session }
                );
            });

            if (!updatedPost) {
                return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
            }

            return new Response(JSON.stringify(updatedPost), { status: 200 });
        } finally {
            session.endSession();
        }
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
