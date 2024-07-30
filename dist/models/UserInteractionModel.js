"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserInteractionSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Types.ObjectId,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    story_id: {
        type: mongoose_1.Types.ObjectId,
        required: false
    },
    comment_id: {
        type: mongoose_1.Types.ObjectId
    },
    duration: {
        type: Number
    },
    meta_data: {
        type: mongoose_1.Schema.Types.Map
    }
});
const UserInteractionModel = (0, mongoose_1.model)('UserInteraction', UserInteractionSchema);
exports.default = UserInteractionModel;
