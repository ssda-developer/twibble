import dbConnect from "@/src/lib/mongoose";
import User from "@/src/models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        let foundUser = null;
        const { user } = await params;

        if (mongoose.Types.ObjectId.isValid(user)) {
            foundUser = await User.findById(user).lean();
        }

        if (!foundUser) {
            foundUser = await User.findOne({ username: user }).lean();
        }

        if (!foundUser) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify(foundUser), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Failed to fetch user:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
