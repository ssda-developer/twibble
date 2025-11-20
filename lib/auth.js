import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Please define JWT_SECRET in .env.local");
}

export async function registerUser(displayName, username, password, avatarColors) {
    await dbConnect();

    const existing = await User.findOne({ displayName: displayName, username: username.toLowerCase() });

    if (existing) {
        throw new Error("Username already taken");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return await User.create({
        displayName,
        username: username.toLowerCase(),
        passwordHash,
        avatarInitials: username.slice(0, 2).toUpperCase(),
        avatarColors
    });
}

export async function loginUser(username, password) {
    await dbConnect();

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
        throw new Error("Invalid credentials");
    }

    return user;
}

export async function setAuthCookie(userId) {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60
    });
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0
    });
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        await dbConnect();
        const user = await User.findById(payload.userId).lean();

        if (!user) return null;
        delete user.passwordHash;

        return user;
    } catch {
        return null;
    }
}
