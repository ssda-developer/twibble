import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true, index: true },
        displayName: { type: String },
        avatarInitials: { type: String, maxlength: 2 },
        bio: { type: String },
        stats: {
            postsCount: { type: Number, default: 0 },
            followersCount: { type: Number, default: 0 },
            followingCount: { type: Number, default: 0 },
            likesGiven: { type: Number, default: 0 },
            savesGiven: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
