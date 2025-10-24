import mongoose from "mongoose";

const { Schema } = mongoose;

const TweetSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 240 },
    metrics: {
        // likes: { type: Number, default: 0, min: 0 },
        likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
        retweets: { type: Number, default: 0, min: 0 },
        reposts: { type: Number, default: 0, min: 0 },
        views: { type: Number, default: 0, min: 0 }
    },
    parentId: { type: Schema.Types.ObjectId, ref: "Tweet", default: null }
}, { timestamps: true });

TweetSchema.virtual("likesCount").get(function () {
    return Array.isArray(this.metrics?.likes) ? this.metrics.likes.length : 0;
});

TweetSchema.statics.addLike = function (tweetId, userId, session) {
    return this.findByIdAndUpdate(
        tweetId,
        { $addToSet: { "metrics.likes": userId } },
        { new: true, session }
    ).populate("user");
};

TweetSchema.statics.removeLike = function (tweetId, userId, session) {
    return this.findByIdAndUpdate(
        tweetId,
        { $pull: { "metrics.likes": userId } },
        { new: true, session }
    ).populate("user");
};


export default mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
