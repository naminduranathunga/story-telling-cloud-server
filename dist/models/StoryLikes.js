"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StoryLikesSchema = new mongoose_1.Schema({
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
    }
});
const StoryLikeModel = (0, mongoose_1.model)('StoryLikes', StoryLikesSchema);
exports.default = StoryLikeModel;
