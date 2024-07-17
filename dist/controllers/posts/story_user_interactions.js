"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_comments_of_the_story = exports.remove_comment_from_story = exports.add_comment_to_story = exports.add_like_to_story = void 0;
const connect_mongodb_1 = __importDefault(require("../../lib/connect_mongodb"));
const ArticleModel_1 = __importDefault(require("../../models/ArticleModel"));
const auth_user_1 = require("../../middleware/auth_user");
const StoryLikes_1 = __importDefault(require("../../models/StoryLikes"));
const mongoose_1 = __importDefault(require("mongoose"));
const StoryComment_1 = __importDefault(require("../../models/StoryComment"));
/**
 * @function add_like_to_story
 * @description Get a single article by id
 */
function add_like_to_story(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connect_mongodb_1.default)();
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found");
            }
            const { story_id } = req.body;
            const article = yield ArticleModel_1.default.findById(story_id).select(["likes", "_id"]);
            if (!article) {
                return res.status(404).json({
                    message: "Article not found"
                });
            }
            // check user has already liked the article
            const user_id = user._id;
            const liked = yield StoryLikes_1.default.findOne({ story_id, user_id });
            let liked_by_me = false;
            if (liked) {
                // remove like
                article.likes -= 1;
                yield StoryLikes_1.default.deleteOne({ story_id, user_id });
                yield article.save();
                liked_by_me = false;
            }
            else {
                // add like
                article.likes += 1;
                const like = new StoryLikes_1.default({ story_id, user_id });
                yield like.save();
                yield article.save();
                liked_by_me = true;
            }
            return res.json({
                message: "Add/Remove like",
                liked: liked_by_me,
                likes: article.likes
            });
        }
        catch (error) {
            console.error("Error getting article", error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.add_like_to_story = add_like_to_story;
/**
 * @function add_comment_to_story
 * @description Place a comment on a story
 */
function add_comment_to_story(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connect_mongodb_1.default)();
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found 0");
            }
            const { story_id, comment, reply_to } = req.body;
            // validate request
            if (!story_id || !mongoose_1.default.Types.ObjectId.isValid(story_id)) {
                return res.status(400).json({ message: "story_id is invalid." });
            }
            if (!comment) {
                return res.status(400).json({ message: "comment is required." });
            }
            if (reply_to && !mongoose_1.default.Types.ObjectId.isValid(reply_to)) {
                return res.status(400).json({ message: "reply_to is invalid." });
            }
            // retrive story article
            const article = yield ArticleModel_1.default.findById(story_id).select(["comments_count", "_id"]);
            if (!article) {
                return res.status(404).json({
                    message: "Story article not found"
                });
            }
            // check user has already liked the article
            const user_id = user._id;
            if (!user_id) {
                return res.status(401).json({
                    message: "User not found"
                });
            }
            const commentDoc = new StoryComment_1.default({ story_id, user_id, comment, reply_to });
            yield commentDoc.save();
            article.comments_count += 1;
            yield article.save();
            return res.json({
                message: "Comment added.",
                comments_count: article.comments_count,
            });
        }
        catch (error) {
            console.error("Error getting article", error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.add_comment_to_story = add_comment_to_story;
/**
 * @function remove_comment_from_story
 * @description Place a comment on a story
 */
function remove_comment_from_story(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connect_mongodb_1.default)();
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found");
            }
            const { story_id, comment_id } = req.body;
            // validate request
            if (!story_id || !mongoose_1.default.Types.ObjectId.isValid(story_id)) {
                return res.status(400).json({ message: "story_id is invalid." });
            }
            if (!comment_id || !mongoose_1.default.Types.ObjectId.isValid(comment_id)) {
                return res.status(400).json({ message: "comment_id is invalid." });
            }
            // retrive story article
            const article = yield ArticleModel_1.default.findById(story_id).select(["comments_count", "_id", "user_id"]);
            if (!article) {
                return res.status(400).json({
                    message: "Story article not found"
                });
            }
            // check user has already liked the article
            const user_id = user._id;
            const commentDoc = yield StoryComment_1.default.findOne({ _id: mongoose_1.default.Types.ObjectId.createFromHexString(comment_id), story_id: mongoose_1.default.Types.ObjectId.createFromHexString(story_id) });
            if (!commentDoc) {
                console.log("Comment not found", commentDoc);
                return res.status(400).json({
                    message: "Comment not found."
                });
            }
            const comm_user = commentDoc.user_id.toHexString();
            if (comm_user !== user_id && user_id !== article.user_id.toHexString()) {
                return res.status(401).json({
                    message: "You are not allowed to delete this comment."
                });
            }
            yield StoryComment_1.default.deleteOne({ _id: commentDoc._id });
            article.comments_count -= 1;
            yield article.save();
            return res.json({
                message: "Comment deleted.",
                comments_count: article.comments_count,
            });
        }
        catch (error) {
            console.error("Error getting article", error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.remove_comment_from_story = remove_comment_from_story;
/**
 * @function get_comments_of_the_story
 * @description Place a comment on a story
 */
function get_comments_of_the_story(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connect_mongodb_1.default)();
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found");
            }
            var { story_id, skip, limit } = req.body;
            // validate request
            if (!story_id || !mongoose_1.default.Types.ObjectId.isValid(story_id)) {
                return res.status(400).json({ message: "story_id is invalid." });
            }
            if (!skip) {
                skip = 0;
            }
            if (!limit) {
                limit = 25;
            }
            // retrive story article
            const article = yield ArticleModel_1.default.findById(story_id).select(["_id", "comments_count"]);
            if (!article) {
                return res.status(400).json({
                    message: "Story article not found"
                });
            }
            // check user has already liked the article
            const user_id = user._id;
            const commentDoc = yield StoryComment_1.default.find({ story_id }).skip(skip).limit(limit).populate("user_id");
            let comments = [];
            commentDoc.forEach((comment) => {
                var _a, _b, _c;
                console.log(comment);
                comments.push({
                    _id: comment._id.toHexString(),
                    comment: comment.comment,
                    reply_to: comment.reply_to,
                    user_id: (_a = comment.user_id) === null || _a === void 0 ? void 0 : _a._id,
                    user_name: (_c = (_b = comment.user_id) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "Anonymous",
                    date_created: comment.date_created.toISOString()
                });
            });
            return res.json({
                message: "Comment deleted.",
                comments_count: article.comments_count,
                comments,
            });
        }
        catch (error) {
            console.error("Error getting article", error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.get_comments_of_the_story = get_comments_of_the_story;
