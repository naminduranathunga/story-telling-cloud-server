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
exports.get_avaliabe_actions = exports.add_action_to_db = exports.record_user_interactions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ArticleModel_1 = __importDefault(require("../../models/ArticleModel"));
const StoryComment_1 = __importDefault(require("../../models/StoryComment"));
const UserInteractionModel_1 = __importDefault(require("../../models/UserInteractionModel"));
const connect_mongodb_1 = __importDefault(require("../../lib/connect_mongodb"));
const auth_user_1 = require("../../middleware/auth_user");
function record_user_interactions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found");
            }
            (0, connect_mongodb_1.default)();
            const { action, story_id, comment_id, duration } = req.body;
            if (!action || typeof action !== "string") {
                return res.status(400).json({
                    message: "Action is required"
                });
            }
            if (get_avaliabe_actions().includes(action) === false) {
                return res.status(400).json({
                    message: "Invalid action"
                });
            }
            // validating individual actions
            // for all actions, story_id is required
            if (!story_id || typeof story_id !== "string" || mongoose_1.default.Types.ObjectId.isValid(story_id) === false) {
                return res.status(400).json({
                    message: "Story id is required"
                });
            }
            const story = yield ArticleModel_1.default.findById(story_id);
            if (!story) {
                return res.status(400).json({
                    message: "Story not found"
                });
            }
            // for comment, comment_id is required
            if (action === "comment") {
                if (!comment_id || typeof comment_id !== "string" || mongoose_1.default.Types.ObjectId.isValid(comment_id) === false) {
                    return res.status(400).json({
                        message: "Comment id is required"
                    });
                }
                // check if the comment exists
                const comment = yield StoryComment_1.default.findById(comment_id);
                if (!comment) {
                    return res.status(400).json({
                        message: "Comment not found"
                    });
                }
            }
            if (action === "read") {
                if (typeof duration !== "number") {
                    console.log("Duration: ", duration);
                    return res.status(400).json({
                        message: "Duration is required"
                    });
                }
            }
            // record the interaction
            add_action_to_db(req.body, user._id);
            console.log("Interaction recorded");
            res.json({
                message: "Interaction recorded"
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.record_user_interactions = record_user_interactions;
function add_action_to_db(action_object, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { action, story_id, comment_id, duration, meta_data } = action_object;
        const newInt = new UserInteractionModel_1.default({
            user_id,
            action,
            story_id,
            comment_id,
            duration,
            meta_data
        });
        return yield newInt.save();
    });
}
exports.add_action_to_db = add_action_to_db;
function get_avaliabe_actions() {
    return ["like", "unlike", "comment", "read"];
}
exports.get_avaliabe_actions = get_avaliabe_actions;
