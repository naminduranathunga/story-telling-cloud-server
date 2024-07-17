
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


/**
 * @function get_user_profile
 * @description Get user profile's public data
 * @method POST
 */

export async function get_user_profile(req: Request, res: Response){
    try {
        const user = get_current_user();
        if (!user) {
            throw new Error("User not found");
        }

        ConnectMongoDB();

        // for testing, we will send random articles
        const { profile_id } = req.body as {
            profile_id: string,
        };
        
        // parse default values
        if (!profile_id || !mongoose.Types.ObjectId.isValid(profile_id)) {
            return res.status(400).json({
                message: "Invalid profile id"
            });
        }

        const user_profile = await UserModel.findOne({_id: profile_id});
        if (!user_profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        const profile = {
            _id: user_profile._id,
            name: user_profile.name,
            description: user_profile.profile?.description,
            cover_image: user_profile.profile?.cover_image,
            profile_image: user_profile.profile?.profile_image,
            followers: user_profile.profile?.followers || 0,
        }

        return res.json({
            message: "Profile public data",
            profile
        });

    } catch (error) {
        console.error("Error getting suggested posts", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



/**
 * @function get_profile_stories
 * @description Get user's publicly available stories
 */

export async function get_profile_stories(req: Request, res: Response){
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