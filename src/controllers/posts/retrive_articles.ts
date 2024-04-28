
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


/**
 * @function get_suggested_articles
 * @description Get suggested articles for the user
 * @method POST
 */

export async function get_suggested_articles(req: Request, res: Response){
    try {
        const user = get_current_user();
        if (!user) {
            throw new Error("User not found");
        }

        ConnectMongoDB();

        // for testing, we will send random articles
        const { page, per_page, order_by, order, tags } = req.body as {
            page?: number, 
            per_page?: number, 
            order_by?: string, 
            order?: string, 
            tags?: string[]
        };
        
        // parse default values
        const page_num = page ? page : 1;
        const per_page_num = per_page ? per_page : 10;
        const order_by_str = order_by ? order_by : "date_created";
        const order_str = order ? order : "desc";

        // create the query
        var query = {};
        if (typeof(tags) !== "undefined" && !tags) {
            // get articles with at least one of the tags
            query = {tags: {$in: tags}};
        }

        const articles = await ArticleModel.find(query)
            .sort({order_by_str: (order_str == "asc" ? 1 : -1)})
            .skip((page_num - 1) * per_page_num)
            .limit(per_page_num);

        // parse the articles to simple articles
        const simple_articles = articles.map(article => {
            const ar = article as unknown as SimpleArticle;
            return {
                _id: ar._id,
                user_id: ar.user_id,
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
        ConnectMongoDB();

        const {article_id} = req.body as {article_id: string};

        const article = await ArticleModel.findById(article_id);
        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        return res.json({
            message: "Article found",
            article: article as unknown as FullArticle
        });

    } catch (error) {
        console.error("Error getting article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}