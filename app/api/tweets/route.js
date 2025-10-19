import { TWEETS } from "@/base";
import { NextResponse } from "next/server";

export async function GET() {
    await new Promise((r) => setTimeout(r, 200));
    return NextResponse.json(TWEETS, { status: 200 });
}
