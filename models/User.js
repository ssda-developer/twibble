import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 15
        },
        passwordHash: { type: String, required: true },
        displayName: { type: String, trim: true, maxlength: 18 },
        avatar: {
            initials: { type: String, maxlength: 2 },
            colors: {
                background: { type: String, default: "#0086D1" },
                text: { type: String, default: "#ffffff" }
            }
        },
        bio: { type: String, maxlength: 280 },
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

UserSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
