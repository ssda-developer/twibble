import { registerUser, setAuthCookie } from "@/lib/auth.js";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { displayName, username, password, avatarColors } = body;

        if (!displayName) {
            return NextResponse.json(
                { error: "Display name is required" },
                { status: 400 }
            );
        }

        if (!username) {
            return NextResponse.json(
                { error: "User name is required" },
                { status: 400 }
            );
        }

        if (!password) {
            return NextResponse.json(
                { error: "Password is required" },
                { status: 400 }
            );
        }

        if (displayName.length < 3) {
            return NextResponse.json(
                { error: "Display name must be at least 3 characters" },
                { status: 400 }
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                { error: "User name must be at least 3 characters" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const user = await registerUser(displayName, username, password, avatarColors);
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
            { error: err.message || "Registration failed" },
            { status: 400 }
        );
    }
}
