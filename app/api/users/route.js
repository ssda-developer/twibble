import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

/**
 * GET /api/users?page=1&limit=20&search=username
 */
export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const search = searchParams.get("search") || "";

        const filter = search
            ? { username: { $regex: search, $options: "i" } }
            : {};

        const users = await User.find(filter)
            .select("_id username displayName avatar bio stats")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(filter);

        return new Response(JSON.stringify({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            users
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

/**
 * POST /api/users/create
 */
export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { username, displayName, avatar, bio } = body;

        if (!username) {
            return new Response(JSON.stringify({ error: "Username is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const newUser = await User.create({
            username,
            displayName: displayName || "",
            avatar: avatar || {},
            bio: bio || "",
            likedPostsCache: [],
            savedPostsCache: [],
            stats: {
                postsCount: 0,
                followersCount: 0,
                followingCount: 0,
                likesGiven: 0,
                savesGiven: 0
            }
        });

        return new Response(JSON.stringify({ user: newUser }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Failed to create user:", error);
        return new Response(JSON.stringify({ error: "Failed to create user" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
