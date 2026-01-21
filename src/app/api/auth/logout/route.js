import { clearAuthCookie } from "@/src/lib/auth.js";
import { NextResponse } from "next/server";

export async function POST() {
    await clearAuthCookie();
    return NextResponse.json({ ok: true });
}
