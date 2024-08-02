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
exports.get_article_body = exports.get_article = exports.get_suggested_article_personalized = exports.get_suggested_articles = void 0;
const connect_mongodb_1 = __importDefault(require("../../lib/connect_mongodb"));
const auth_user_1 = require("../../middleware/auth_user");
const ArticleModel_1 = __importDefault(require("../../models/ArticleModel"));
const StoryLikes_1 = __importDefault(require("../../models/StoryLikes"));
const execute_cmd_and_get_output_1 = require("../../lib/execute_cmd_and_get_output");
/**
 * @function get_suggested_articles
 * @description Get suggested articles for the user
 * @method POST
 */
function get_suggested_articles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield get_suggested_article_personalized(req, res);
        return;
        /*
        try {
            const user = get_current_user();
            if (!user) {
                throw new Error("User not found");
            }
    
            await ConnectMongoDB();
    
            // for testing, we will send random articles
            const { page, per_page, order_by, order, tags, category, search } = req.body as {
                page?: number,
                per_page?: number,
                order_by?: string,
                order?: string,
                tags?: string[],
                category?: string,
                search?: string,
            };
            
            // parse default values
            const page_num = page ? page : 1;
            const per_page_num = per_page ? per_page : 20;
            const order_by_str = order_by ? order_by : "date_created";
            const order_str = order ? order : "desc";
    
            // create the query
            var query = {};
            if (typeof(tags) !== "undefined" && !tags) {
                // get articles with at least one of the tags
                query = {tags: {$in: tags}};
            }
            if (typeof(category) !== "undefined" && !category) {
                query = {...query, category: mongoose.Types.ObjectId.createFromHexString(category)};
            }
            if (typeof(search) !== "undefined" && !search) {
                query = {...query, $or: [
                    {title: {$regex: search, $options: "i"}},
                    {content_plain: {$regex: search, $options: "i"}}
                ]};
            }
            if (typeof(search) !== "undefined" && !search) {
                query = {...query, $text: {$search: search}};
            }
    
            const articles = await ArticleModel.find(query)
                .sort({order_by_str: (order_str == "asc" ? 1 : -1)})
                .skip((page_num - 1) * per_page_num)
                .limit(per_page_num)
                .populate("user_id");
    
            // parse the articles to simple articles
            const simple_articles = articles.map(article => {
                console.log(article);
                const ar = article as any;
                return {
                    _id: ar._id,
                    user_id: ar.user_id?._id ?? "Unknown",
                    user_name: ar.user_id?.name ?? "Unknown",
                    title: ar.title,
                    thumbnail: ar.thumbnail,
                    tags: ar.tags,
                    likes: ar.likes,
                    comments_count: ar.comments_count,
                    share_count: ar.share_count,
                    
                }
            });
    
            return res.json({
                message: "Suggested articles",
                articles: simple_articles
            });
    
        } catch (error) {
            console.error("Error getting suggested posts", error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }*/
    });
}
exports.get_suggested_articles = get_suggested_articles;
/**
 * @function get_suggested_article_personalized
 * @description Get suggested articles for the user based on their interests. This will use external script to retrive artivcles as Full article format
 * @method POST
 *
 */
function get_suggested_article_personalized(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (0, auth_user_1.get_current_user)();
            if (!user) {
                throw new Error("User not found");
            }
            yield (0, connect_mongodb_1.default)();
            // for testing, we will send random articles
            const { page, per_page, order_by, order, tags, category, search } = req.body;
            // parse default values
            const page_num = page ? page : 1;
            const per_page_num = per_page ? per_page : 20;
            const order_by_str = order_by ? order_by : "date_created";
            const order_str = order ? order : "desc";
            var articles = [];
            const py = process.env.PYTHON_PATH;
            const pp = process.env.SUGGESION_API;
            const cmd = py + " \"" + pp + "\" --user_id=" + user._id + " --page=" + page_num + " --perPage=" + per_page_num
                + " --search=\"" + (search ? search : "") + "\"";
            /*const cmd = "python D:\\websites\\CloudComp\\story-telling-cloud-server\\hello.py --user_id=" + user._id + " --page=" + page_num + " --per_page=" + per_page_num
                        + " --search=\"" + (search?search:"")+ "\""*/
            // execute the command
            const output = yield (0, execute_cmd_and_get_output_1.execute_cmd_and_get_output)(cmd);
            articles = JSON.parse(output);
            // retrive articles for ids
            const query = {
                _id: { $in: articles }
            };
            articles = yield ArticleModel_1.default.find(query)
                .populate("user_id");
            // parse the articles to simple articles
            const simple_articles = articles.map(article => {
                var _a, _b, _c, _d;
                const ar = article;
                return {
                    _id: ar._id,
                    user_id: (_b = (_a = ar.user_id) === null || _a === void 0 ? void 0 : _a._id) !== null && _b !== void 0 ? _b : "Unknown",
                    user_name: (_d = (_c = ar.user_id) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "Unknown",
                    title: ar.title,
                    thumbnail: ar.thumbnail,
                    tags: ar.tags,
                    likes: ar.likes,
                    comments_count: ar.comments_count,
                    share_count: ar.share_count,
                };
            });
            return res.json({
                message: "Suggested articles",
                articles: simple_articles
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
exports.get_suggested_article_personalized = get_suggested_article_personalized;
/**
 * @function get_article
 * @description Get a single article by id
 */
function get_article(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            yield (0, connect_mongodb_1.default)();
            const { story_id } = req.body;
            const article = yield ArticleModel_1.default.findById(story_id).populate("user_id");
            if (!article) {
                return res.status(404).json({
                    message: "Article not found"
                });
            }
            const myLike = yield StoryLikes_1.default.findOne({ story_id: article._id, user_id: (_a = (0, auth_user_1.get_current_user)()) === null || _a === void 0 ? void 0 : _a._id });
            const article_ = {
                _id: article._id,
                user_id: (_c = (_b = article.user_id) === null || _b === void 0 ? void 0 : _b._id) !== null && _c !== void 0 ? _c : "Unknown",
                user_name: (_e = (_d = article.user_id) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : "Unknown",
                title: article.title,
                content: article.content,
                content_plain: article.content_plain,
                audio_version: article.audio_version,
                thumbnail: article.thumbnail,
                images: article.images,
                tags: article.tags,
                likes: article.likes,
                comments_count: article.comments_count,
                share_count: article.share_count,
                created_at: article.date_created,
                did_i_liked: myLike ? true : false,
                //body: article.body ? article.body : []
            };
            return res.json({
                message: "Article found",
                story: article_
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
exports.get_article = get_article;
/**
 * @function get_article_body
 * @description Get a single article by id
 */
function get_article_body(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connect_mongodb_1.default)();
            const { story_id } = req.body;
            const article = yield ArticleModel_1.default.findById(story_id).select("body");
            if (!article) {
                return res.status(404).json({
                    message: "Article not found"
                });
            }
            return res.json({
                message: "Article found",
                story: article.body
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
exports.get_article_body = get_article_body;
