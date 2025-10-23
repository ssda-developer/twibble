import dbConnect from "@/lib/mongoose";
import Tweet from "@/models/Tweet";
import mongoose from "mongoose";
import "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();
        const tweets = await Tweet.find({ parentId: null }).populate("user");
        return new Response(JSON.stringify(tweets), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

// export async function POST(req) {
//     try {
//         await dbConnect();
//         const body = await req.json();
//
//         const tweet = await Tweet.create({
//             user: new mongoose.Types.ObjectId("68f54950e06509db67a7cf00"),
//             ...body
//         });
//
//         console.log("Created tweet:", tweet);
//         return new Response(JSON.stringify(tweet), { status: 201 });
//     } catch (err) {
//         console.error("POST error:", err);
//         return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//     }
// }

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { parentId, content } = body || {};

        if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
            return new Response(JSON.stringify({ error: "Invalid parentId" }), { status: 400 });
        }

        const userId = new mongoose.Types.ObjectId("68f54950e06509db67a7cf00");

        const session = await mongoose.startSession();
        let createdTweet;

        try {
            await session.withTransaction(async () => {
                if (parentId) {
                    const parent = await Tweet.findByIdAndUpdate(
                        parentId,
                        { $inc: { "metrics.retweets": 1 } },
                        { new: true, session }
                    );

                    if (!parent) {
                        throw new Error("Parent tweet not found");
                    }
                }

                const [tweetDoc] = await Tweet.create(
                    [
                        {
                            user: userId,
                            content,
                            parentId: parentId || null
                        }
                    ],
                    { session }
                );

                createdTweet = tweetDoc;
            });

            if (!createdTweet) {
                return new Response(JSON.stringify({ error: "Failed to create tweet" }), { status: 500 });
            }

            return new Response(JSON.stringify(createdTweet), { status: 201 });
        } catch (txErr) {
            if (txErr?.message === "Parent tweet not found") {
                return new Response(JSON.stringify({ error: txErr.message }), { status: 404 });
            }
            console.error("Transaction error:", txErr);
            return new Response(JSON.stringify({ error: txErr.message }), { status: 500 });
        } finally {
            session.endSession();
        }
    } catch (err) {
        console.error("POST error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
