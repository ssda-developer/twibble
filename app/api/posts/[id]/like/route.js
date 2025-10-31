import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import mongoose from "mongoose";

/**
 * PATCH /api/posts/:id/like
 * body: { action: "like" | "unlike", userId: string }
 */
export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { action, userId } = await req.json();

        if (!["like", "unlike"].includes(action)) {
            return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return new Response(JSON.stringify({ error: "Invalid userId" }), { status: 400 });
        }

        const session = await mongoose.startSession();

        try {
            let updated;
            await session.withTransaction(async () => {
                if (action === "like") {
                    updated = await Post.addLike(id, userId, session);
                } else {
                    updated = await Post.removeLike(id, userId, session);
                }
            });

            if (!updated) {
                return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
            }

            return new Response(JSON.stringify(updated), { status: 200 });
        } catch (txErr) {
            console.error(txErr);
            return new Response(JSON.stringify({ error: txErr.message }), { status: 500 });
        } finally {
            session.endSession();
        }
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
