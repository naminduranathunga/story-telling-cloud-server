import { Request, Response } from "express";
import { get_current_user } from "../../middleware/auth_user";
import { FullArticle } from "../../interfaces/user_article";
import ArticleModel from "../../models/ArticleModel";
import ConnectMongoDB from "../../lib/connect_mongodb";


export async function create_article(req: Request, res: Response){
    try {
        const user = get_current_user();
        if (!user) {
            throw new Error("User not found");
        }

        const article = req.body as FullArticle;
        article.user_id = user._id;

        ConnectMongoDB();
        
        // Save article to database
        const article_m = new ArticleModel(article);
        await article_m.save();

        return res.json({
            message: "Article created successfully",
            article: article_m
        });

    } catch (error) {
        console.error("Error creating article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export async function delete_article(req: Request, res: Response){
    try {
        const user = get_current_user();
        if (!user) {
            throw new Error("User not found");
        }

        const {article_id} = req.body as {article_id: string};
        
        ConnectMongoDB();

        // get the article
        const article = await ArticleModel.findById(article_id);
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
        await ArticleModel.deleteOne({_id: article_id});

        return res.json({
            message: "Article deleted successfully"
        });

    } catch (error) {
        console.error("Error creating article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

/**
 * @function get_editable_article
 * returns an article for editing
 */


/**
 * @function update_article
 * Once edited, the user can update the password 
 */