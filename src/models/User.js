import { DISPLAY_NAME_MAX_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/src/constants/validation";
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
            minlength: USERNAME_MIN_LENGTH,
            maxlength: USERNAME_MAX_LENGTH
        },
        passwordHash: { type: String, required: true },
        displayName: { type: String, required: true, trim: true, maxlength: DISPLAY_NAME_MAX_LENGTH },
        avatar: {
            initials: { type: String, maxlength: 2 },
            colors: {
                background: { type: String, default: "#0086D1" },
                text: { type: String, default: "#ffffff" }
            }
        },
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
