import { Schema, Types, model } from "mongoose";

const StoryLikesSchema = new Schema({
    story_id: {
        type: Types.ObjectId,
        required: true,
        ref: "Article"
    },
    user_id: {
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

const StoryLikeModel = model('StoryLikes', StoryLikesSchema);
export default StoryLikeModel;