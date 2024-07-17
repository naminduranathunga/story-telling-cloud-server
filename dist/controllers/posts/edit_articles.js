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
exports.delete_article = exports.create_article = void 0;
const auth_user_1 = require("../../middleware/auth_user");
const ArticleModel_1 = __importDefault(require("../../models/ArticleModel"));
const connect_mongodb_1 = __importDefault(require("../../lib/connect_mongodb"));
function create_article(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found");
            }
            const article = req.body;
            article.user_id = user._id;
            (0, connect_mongodb_1.default)();
            // Save article to database
            const article_m = new ArticleModel_1.default(article);
            yield article_m.save();
            return res.json({
                message: "Article created successfully",
                article: article_m
            });
        }
        catch (error) {
            console.error("Error creating article", error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.create_article = create_article;
function delete_article(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found");
            }
            const { article_id } = req.body;
            (0, connect_mongodb_1.default)();
            // get the article
            const article = yield ArticleModel_1.default.findById(article_id);
            if (!article) {
                return res.status(404).json({
                    message: "Article not found"
                });
            }
            if (article.user_id != user._id) {
                return res.status(403).json({
                    message: "You are not authorized to delete this article"
                });
            }
            // delete the article
            yield ArticleModel_1.default.deleteOne({ _id: article_id });
            return res.json({
                message: "Article deleted successfully"
            });
        }
        catch (error) {
            console.error("Error creating article", error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    });
}
exports.delete_article = delete_article;
/**
 * @function get_editable_article
 * returns an article for editing
 */
/**
 * @function update_article
 * Once edited, the user can update the password
 */ 
