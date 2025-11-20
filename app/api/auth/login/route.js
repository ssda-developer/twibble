import { loginUser, setAuthCookie } from "@/lib/auth.js";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        const user = await loginUser(username, password);
        await setAuthCookie(user._id.toString());

        const userSafe = {
            _id: user._id.toString(),
            username: user.username,
            displayName: user.displayName,
            avatarInitials: user.avatarInitials,
            avatarColors: user.avatarColors,
            stats: user.stats,
            createdAt: user.createdAt
        };

        return NextResponse.json({ ok: true, user: userSafe });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Login failed" },
            { status: 401 }
        );
    }
}
