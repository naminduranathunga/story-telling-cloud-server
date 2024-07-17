"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StoryCommentSchema = new mongoose_1.Schema({
    story_id: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: "Article"
    },
    user_id: {
        type: mongoose_1.Types.ObjectId,
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
        type: mongoose_1.Types.ObjectId,
        required: false,
        ref: "StoryLikes"
    }
});
const StoryCommentModel = (0, mongoose_1.model)('StoryComments', StoryCommentSchema);
exports.default = StoryCommentModel;
