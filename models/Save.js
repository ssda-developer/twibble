import mongoose, { Schema } from "mongoose";

const SaveSchema = new Schema(
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

SaveSchema.index({ user: 1, post: 1 }, { unique: true });
SaveSchema.index({ post: 1, createdAt: -1 });

export default mongoose.models.Save || mongoose.model("Save", SaveSchema);
