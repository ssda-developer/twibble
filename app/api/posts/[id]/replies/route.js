import dbConnect from "@/lib/mongoose";
import Tweet from "@/models/Tweet";
import mongoose from "mongoose";
import "@/models/User";

export async function GET(_req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const posts = await Tweet.find({ parentId: new mongoose.Types.ObjectId(id) }).populate("user");
        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
