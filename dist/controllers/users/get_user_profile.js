"use strict";
/**
 * This files has controller functions to retrive articles from the database
 *
 */
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
exports.get_profile_stories = exports.get_user_profile = void 0;
const connect_mongodb_1 = __importDefault(require("../../lib/connect_mongodb"));
const auth_user_1 = require("../../middleware/auth_user");
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const ArticleModel_1 = __importDefault(require("../../models/ArticleModel"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @function get_user_profile
 * @description Get user profile's public data
 * @method POST
 */
function get_user_profile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found");
            }
            (0, connect_mongodb_1.default)();
            // for testing, we will send random articles
            const { profile_id } = req.body;
            // parse default values
            if (!profile_id || !mongoose_1.default.Types.ObjectId.isValid(profile_id)) {
                return res.status(400).json({
                    message: "Invalid profile id"
                });
            }
            const user_profile = yield UserModel_1.default.findOne({ _id: profile_id });
            if (!user_profile) {
                return res.status(404).json({
                    message: "Profile not found"
                });
            }
            const profile = {
                _id: user_profile._id,
                name: user_profile.name,
                description: (_a = user_profile.profile) === null || _a === void 0 ? void 0 : _a.description,
                cover_image: (_b = user_profile.profile) === null || _b === void 0 ? void 0 : _b.cover_image,
                profile_image: (_c = user_profile.profile) === null || _c === void 0 ? void 0 : _c.profile_image,
                followers: ((_d = user_profile.profile) === null || _d === void 0 ? void 0 : _d.followers) || 0,
            };
            return res.json({
                message: "Profile public data",
                profile
            });
        }
        catch (error) {
            console.error("Error getting suggested posts", error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.get_user_profile = get_user_profile;
/**
 * @function get_profile_stories
 * @description Get user's publicly available stories
 */
function get_profile_stories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, connect_mongodb_1.default)();
            const { article_id } = req.body;
            const article = yield ArticleModel_1.default.findById(article_id);
            if (!article) {
                return res.status(404).json({
                    message: "Article not found"
                });
            }
            return res.json({
                message: "Article found",
                article: article
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
exports.get_profile_stories = get_profile_stories;
