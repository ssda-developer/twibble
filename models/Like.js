import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true
        },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: false }
);

LikeSchema.index({ user: 1, post: 1 }, { unique: true });
LikeSchema.index({ post: 1 });

export default mongoose.models.Like || mongoose.model("Like", LikeSchema);
