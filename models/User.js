import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true, maxlength: 50 },
    username: { type: String, required: true, maxlength: 30 },
    avatarUrl: { type: String, maxlength: 200 },
    avatarInitials: { type: String, maxlength: 2 }
}, { _id: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);

