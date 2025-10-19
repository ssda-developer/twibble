import { TWEETS } from "@/base";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
    const id = Number(params?.id);

    if (Number.isNaN(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await new Promise((r) => setTimeout(r, 200));

    const tweet = TWEETS.find((t) => t.id === id);

    if (!tweet) {
        return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    return NextResponse.json(tweet, { status: 200 });
}
