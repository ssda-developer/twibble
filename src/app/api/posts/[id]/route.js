import { DEFAULT_PAGE_SIZE } from "@/src/constants";
import { addUserStateToPosts } from "@/src/features/utils";
import dbConnect from "@/src/lib/mongoose";
import Like from "@/src/models/Like";
import Post from "@/src/models/Post";
import Save from "@/src/models/Save";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const currentUserId = searchParams.get("currentUserId");
        const includeParents = searchParams.get("includeParents") === "true";
        const includeDepth = Math.max(
            1,
            Math.min(100, parseInt(searchParams.get("includeDepth") || DEFAULT_PAGE_SIZE, 10))
        );

        const post = await Post.findById(id)
            .populate({
                path: "author",
                select: "_id username displayName avatar"
            })
            .populate({
                path: "repostedPost",
                select: "_id author content media type",
                populate: {
                    path: "author",
                    select: "_id username displayName avatar"
                }
            })
            .lean();

        if (!post) {
            return new Response(JSON.stringify({ error: "Post not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        let parents = [];

        if (includeParents) {
            let currentParentId = post.parentPost;
            let depth = 0;
            const seen = new Set();
            while (currentParentId && depth < includeDepth) {
                if (seen.has(String(currentParentId))) break;
                seen.add(String(currentParentId));

                const parent = await Post.findById(currentParentId)
                    .populate({
                        path: "author",
                        select: "_id username displayName avatar"
                    })
                    .populate({
                        path: "repostedPost",
                        select: "_id author content media type",
                        populate: {
                            path: "author",
                            select: "_id username displayName avatar"
                        }
                    })
                    .lean();
                if (!parent) break;

                parents.push(parent);

                currentParentId = parent.parentPost;
                depth += 1;
            }

            parents = parents.reverse();
        }

        if (includeParents && parents.length > 0) {
            const parentsWithState = await addUserStateToPosts(parents, currentUserId);
            const postWithState = await addUserStateToPosts(post, currentUserId);

            return new Response(
                JSON.stringify({ post: postWithState, parents: parentsWithState }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } else {
            const postWithState = await addUserStateToPosts(post, currentUserId);

            return new Response(
                JSON.stringify({ post: postWithState }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error("Failed to fetch post:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch post" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const deleted = await Post.findByIdAndDelete(id);

        if (!deleted) {
            return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
        }

        await Promise.all([
            Like.deleteMany({ post: deleted._id }),
            Save.deleteMany({ post: deleted._id })
        ]);

        return new Response(JSON.stringify({ ok: true, id: deleted._id }), { status: 200 });
    } catch (error) {
        console.error("Failed to delete post:", error);
        return new Response(JSON.stringify({ error: "Failed to delete post" }), { status: 500 });
    }
}
