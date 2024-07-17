"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ArticleImageSchema = new mongoose_1.Schema({
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
});
const ArticleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: (Array),
        required: false
    },
    date_created: {
        type: Date,
        default: Date.now,
        required: false
    },
    date_updated: {
        type: Date,
        default: Date.now,
        required: false /*doc.markModified('pathToYourDate') */
    },
    content: {
        type: String,
        required: true
    },
    content_plain: {
        type: String,
        required: false
    },
    audio_version: {
        type: String,
        required: false
    },
    thumbnail: {
        type: String,
        required: false
    },
    images: [ArticleImageSchema],
    likes: {
        type: Number,
        default: 0,
        required: false
    },
    comments_count: {
        type: Number,
        default: 0,
        required: false
    },
    share_count: {
        type: Number,
        default: 0,
        required: false
    },
    categories: {
        type: (Array),
        ref: 'Category',
        required: false
    },
    body: {
        type: (Array),
        required: false,
        default: []
    }
});
const ArticleModel = (0, mongoose_1.model)('Article', ArticleSchema);
exports.default = ArticleModel;
