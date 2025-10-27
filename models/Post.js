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

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
