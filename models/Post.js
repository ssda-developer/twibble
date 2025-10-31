import Like from "@/models/Like";
import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

        authorSnapshot: {
            _id: { type: Schema.Types.ObjectId, required: true },
            username: { type: String, required: true },
            displayName: { type: String },
            avatarInitials: { type: String }
        },

        content: { type: String, maxlength: 280 },
        media: [
            {
                url: String,
                type: { type: String, enum: ["image", "video", "gif"] },
                meta: Object
            }
        ],

        type: { type: String, enum: ["original", "repost", "reply"], default: "original" },

        originalPost: { type: Schema.Types.ObjectId, ref: "Post" },

        parentPost: { type: Schema.Types.ObjectId, ref: "Post" },
        rootPost: { type: Schema.Types.ObjectId, ref: "Post" },

        likeCount: { type: Number, default: 0 },
        replyCount: { type: Number, default: 0 },
        repostCount: { type: Number, default: 0 },
        saveCount: { type: Number, default: 0 },

        deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ rootPost: 1 });
PostSchema.index({ parentPost: 1 });

PostSchema.statics.addLike = async function (postId, userId, session) {
    const post = await this.findById(postId);
    if (!post) return null;

    const existing = await Like.findOne({ post: postId, user: userId }).session(session);
    if (existing) return post;

    await Like.create([{ post: postId, user: userId }], { session });

    post.likeCount += 1;
    await post.save({ session });

    return post;
};

PostSchema.statics.removeLike = async function (postId, userId, session) {
    const post = await this.findById(postId);
    if (!post) return null;

    const res = await Like.deleteOne({ post: postId, user: userId }).session(session);
    if (res.deletedCount > 0) {
        post.likeCount = Math.max(0, post.likeCount - 1);
        await post.save({ session });
    }

    return post;
};

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
