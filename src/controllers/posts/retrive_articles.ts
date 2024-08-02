
/**
 * This files has controller functions to retrive articles from the database
 * 
 */

import { Request, Response } from "express";
import ConnectMongoDB from "../../lib/connect_mongodb";
import { get_current_user } from "../../middleware/auth_user";
import UserModel from "../../models/UserModel";
import { FullArticle, SimpleArticle } from "../../interfaces/user_article";
import ArticleModel from "../../models/ArticleModel";
import mongoose from "mongoose";
import StoryLikeModel from "../../models/StoryLikes";
import { execute_cmd_and_get_output } from "../../lib/execute_cmd_and_get_output";


/**
 * @function get_suggested_articles
 * @description Get suggested articles for the user
 * @method POST
 */

export async function get_suggested_articles(req: Request, res: Response){
    await get_suggested_article_personalized(req, res);
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
}



/**
 * @function get_suggested_article_personalized
 * @description Get suggested articles for the user based on their interests. This will use external script to retrive artivcles as Full article format
 * @method POST
 * 
 */
export async function get_suggested_article_personalized(req: Request, res: Response) {
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

        var articles:any[] = [];
        const py = process.env.PYTHON_PATH;
        const pp = process.env.SUGGESION_API;
        
        const cmd = py + " \""+ pp + "\" --user_id=" + user._id + " --page=" + page_num + " --perPage=" + per_page_num
                    + " --search=\"" + (search?search:"")+ "\""

        
        /*const cmd = "python D:\\websites\\CloudComp\\story-telling-cloud-server\\hello.py --user_id=" + user._id + " --page=" + page_num + " --per_page=" + per_page_num
                    + " --search=\"" + (search?search:"")+ "\""*/
        // execute the command
        const output = await execute_cmd_and_get_output(cmd);

        articles = JSON.parse(output);

        // retrive articles for ids
        const query = {
            _id: {$in: articles}
        }
        articles = await ArticleModel.find(query)
            .populate("user_id");

        // parse the articles to simple articles
        const simple_articles = articles.map(article => {
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
    }
}




/**
 * @function get_article
 * @description Get a single article by id
 */

export async function get_article(req: Request, res: Response){
    try {
        await ConnectMongoDB();

        const {story_id} = req.body as {story_id: string};

        const article:any = await ArticleModel.findById(story_id).populate("user_id");
        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        const myLike = await StoryLikeModel.findOne({story_id: article._id, user_id: get_current_user()?._id});

        const article_: FullArticle = {
            _id: article._id,
            user_id: article.user_id?._id ?? "Unknown",
            user_name: article.user_id?.name ?? "Unknown",
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
        }



        return res.json({
            message: "Article found",
            story: article_
        });

    } catch (error) {
        console.error("Error getting article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



/**
 * @function get_article_body
 * @description Get a single article by id
 */

export async function get_article_body(req: Request, res: Response){
    try {
        await ConnectMongoDB();

        const {story_id} = req.body as {story_id: string};

        const article:any = await ArticleModel.findById(story_id).select("body");
        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        return res.json({
            message: "Article found",
            story: article.body
        });

    } catch (error) {
        console.error("Error getting article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
