import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import mongoose from "mongoose";

/**
 * PATCH /api/posts/:id/edit
 * body: { content: string, media: array }
 */
export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const body = await req.json();

        const session = await mongoose.startSession();
        let updatedPost;

        try {
            await session.withTransaction(async () => {
                updatedPost = await Post.findByIdAndUpdate(
                    id,
                    { ...body },
                    { new: true, session }
                ).populate("author", "_id username displayName avatar");
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
