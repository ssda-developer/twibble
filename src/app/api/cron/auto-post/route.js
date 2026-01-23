import { AI_CHARACTERS, SYSTEM_PROMPTS, USER_PROMPTS } from "@/constants/ai-config";
import { POST_TYPES } from "@/constants/post-types";
import { POST_MAX_LENGTH } from "@/constants/validation";
import dbConnect from "@/lib/mongoose";
import Post from "@/models/Post";
import User from "@/models/User";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function generateAIContent(systemMsg, userMsg) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "llama-3.3-70b-versatile",
            "messages": [
                { "role": "system", "content": systemMsg },
                { "role": "user", "content": userMsg }
            ],
            "temperature": 0.8,
            "presence_penalty": 0.8,
            "frequency_penalty": 1.0,
            "max_tokens": 80
        })
    });
    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || "No answer";
}

export async function GET() {
    try {
        await dbConnect();

        const randomName = AI_CHARACTERS[Math.floor(Math.random() * AI_CHARACTERS.length)];
        const character = await User.findOne({ displayName: randomName });

        if (!character) {
            return new Response(`Character ${randomName} not found in DB`, { status: 404 });
        }

        let type = POST_TYPES.ORIGINAL;
        let parentPostId = null;
        let rootPostId = null;
        let finalContent = "";

        const isCommentAttempt = Math.random() >= 0.2;

        if (isCommentAttempt) {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const potentialPosts = await Post.find({
                createdAt: { $gte: weekAgo },
                author: { $ne: character._id }
            }).sort({ createdAt: -1 }).limit(20);

            if (potentialPosts.length > 0) {
                const targetPost = potentialPosts[Math.floor(Math.random() * potentialPosts.length)];

                if (Math.random() > 0.1) {
                    await Post.addLike(targetPost._id, character._id);
                }

                type = POST_TYPES.REPLY;
                parentPostId = targetPost._id;
                rootPostId = targetPost.rootPost || targetPost._id;

                finalContent = await generateAIContent(
                    SYSTEM_PROMPTS.GHOSTWRITER(POST_MAX_LENGTH),
                    USER_PROMPTS.REPLY(randomName, targetPost.content)
                );

                await Post.findByIdAndUpdate(parentPostId, { $inc: { replyCount: 1 } });
            }
        }

        if (!finalContent) {
            type = POST_TYPES.ORIGINAL;
            finalContent = await generateAIContent(
                SYSTEM_PROMPTS.GHOSTWRITER(POST_MAX_LENGTH),
                USER_PROMPTS.ORIGINAL(randomName)
            );
        }

        const newPost = await Post.create({
            author: character._id,
            content: finalContent,
            type,
            parentPost: parentPostId,
            rootPost: rootPostId
        });

        return new Response(JSON.stringify({ success: true, post: newPost }), { status: 201 });
    } catch (error) {
        console.error("AI Post Error:", error);
        return new Response(error.message, { status: 500 });
    }
}
