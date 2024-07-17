import { Schema, Types, model } from "mongoose";

const StoryCommentSchema = new Schema({
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
    },
    comment: {
        type: String,
        required: true,
    },
    reply_to: { 
        type: Types.ObjectId,
        required: false,
        ref: "StoryLikes"
    }
});

const StoryCommentModel = model('StoryComments', StoryCommentSchema);
export default StoryCommentModel;