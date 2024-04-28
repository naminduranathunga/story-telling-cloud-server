import { Schema, Types, model } from "mongoose";

const ArticleImageSchema = new Schema({
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
});
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: Types.ObjectId,
        required: true
    },
    tags: {
        type: Array<String>,
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
});

const ArticleModel = model('Article', ArticleSchema);
export default ArticleModel;