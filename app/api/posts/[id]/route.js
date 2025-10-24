import dbConnect from "@/lib/mongoose";
import Tweet from "@/models/Tweet";
import mongoose from "mongoose";
import "@/models/User";

export async function GET(_req, { params }) {
    try {
        await dbConnect();
        const { id } = params || {};
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400 });
        }
        const post = await Tweet.findById(id).populate("user");
        if (!post) {
            return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(post), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params || {};
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400 });
        }

        const body = await req.json();
        const { action, userId } = body || {};

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
                    updated = await Tweet.addLike(id, userId, session);
                } else {
                    updated = await Tweet.removeLike(id, userId, session);
                }
            });

            if (!updated) {
                return new Response(JSON.stringify({ error: "Tweet not found" }), { status: 404 });
            }
            return new Response(JSON.stringify(updated), { status: 200 });
        } catch (txErr) {
            return new Response(JSON.stringify({ error: txErr.message }), { status: 500 });
        } finally {
            session.endSession();
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
