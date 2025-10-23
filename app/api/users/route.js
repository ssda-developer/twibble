import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();
        const users = await User.find();
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const user = await User.create({
            name: body.name || "Test User",
            username: body.username || "testuser",
            avatarUrl: body.avatarUrl || "",
            avatarInitials: body.avatarInitials || "TU"
        });

        console.log("Created user:", user);
        return new Response(JSON.stringify(user), { status: 201 });
    } catch (err) {
        console.error("POST error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

