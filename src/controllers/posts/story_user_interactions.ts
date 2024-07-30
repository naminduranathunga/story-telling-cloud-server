
import { Request, Response } from "express";
import ConnectMongoDB from "../../lib/connect_mongodb";
import ArticleModel from "../../models/ArticleModel";
import { get_current_user } from "../../middleware/auth_user";
import StoryLikeModel from "../../models/StoryLikes";
import mongoose from "mongoose";
import StoryCommentModel from "../../models/StoryComment";
import { add_action_to_db } from "../interactions/record_interactions";



/**
 * @function add_like_to_story
 * @description Get a single article by id
 */
export async function add_like_to_story(req: Request, res: Response){
    try {
        await ConnectMongoDB();

        const user = get_current_user();
        if (!user) {
            throw new Error("User not found");
        }

        const {story_id} = req.body as {story_id: string};

        const article:any = await ArticleModel.findById(story_id).select(["likes", "_id"]);
        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        // check user has already liked the article
        const user_id = user._id;
        const liked = await StoryLikeModel.findOne({story_id, user_id});
        let liked_by_me = false;
        if (liked) {
            // remove like
            article.likes -= 1;
            await StoryLikeModel.deleteOne({story_id, user_id});
            await article.save();
            liked_by_me = false;

            try{
                add_action_to_db({
                    action: "like",
                    story_id,
                }, user._id);
            } catch (error) {
                console.error("Error adding action to db", error);
            }

        } else {
            // add like
            article.likes += 1;
            const like = new StoryLikeModel({story_id, user_id});
            await like.save();
            await article.save();
            liked_by_me = true;
        }


        return res.json({
            message: "Add/Remove like",
            liked: liked_by_me,
            likes: article.likes
        });

    } catch (error) {
        console.error("Error getting article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



/**
 * @function add_comment_to_story
 * @description Place a comment on a story
 */

export async function add_comment_to_story(req: Request, res: Response){
    try {
        await ConnectMongoDB();

        const user = get_current_user();
        if (!user) {
            throw new Error("User not found 0");
        }

        const {story_id, comment, reply_to} = req.body as {story_id: string, comment:string, reply_to?:string};

        // validate request
        if (!story_id || !mongoose.Types.ObjectId.isValid(story_id)){
            return res.status(400).json({message: "story_id is invalid."});
        }
        if (!comment){
            return res.status(400).json({message: "comment is required."});
        }
        if (reply_to && !mongoose.Types.ObjectId.isValid(reply_to)){
            return res.status(400).json({message: "reply_to is invalid."});
        }

        // retrive story article
        const article:any = await ArticleModel.findById(story_id).select(["comments_count", "_id"]);
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
        const commentDoc = new StoryCommentModel({story_id, user_id, comment, reply_to});
        await commentDoc.save();
        article.comments_count += 1;
        await article.save();

        try{
            add_action_to_db({
                action: "comment",
                story_id,
                comment_id: commentDoc._id,
            }, user._id);
        } catch (error) {
            console.error("Error adding action to db", error);
        }
        

        return res.json({
            message: "Comment added.",
            comments_count: article.comments_count,
        });

    } catch (error) {
        console.error("Error getting article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



/**
 * @function remove_comment_from_story
 * @description Place a comment on a story
 */

export async function remove_comment_from_story(req: Request, res: Response){
    try {
        await ConnectMongoDB();

        const user = get_current_user();
        if (!user) {
            throw new Error("User not found");
        }

        const {story_id, comment_id} = req.body as {story_id: string, comment_id:string};

        // validate request
        if (!story_id || !mongoose.Types.ObjectId.isValid(story_id)){
            return res.status(400).json({message: "story_id is invalid."});
        }
        if (!comment_id || !mongoose.Types.ObjectId.isValid(comment_id)){
            return res.status(400).json({message: "comment_id is invalid."});
        }

        // retrive story article
        const article:any = await ArticleModel.findById(story_id).select(["comments_count", "_id", "user_id"]);
        if (!article) {
            return res.status(400).json({
                message: "Story article not found"
            });
        }

        // check user has already liked the article
        const user_id = user._id;
        const commentDoc = await StoryCommentModel.findOne({_id:mongoose.Types.ObjectId.createFromHexString(comment_id), story_id:mongoose.Types.ObjectId.createFromHexString(story_id)});
        if (!commentDoc){
            console.log("Comment not found", commentDoc);
            return res.status(400).json({
                message: "Comment not found."
            });
        }
        const comm_user = (commentDoc.user_id as mongoose.Types.ObjectId).toHexString();
        if (comm_user !== user_id && user_id !== (article.user_id as mongoose.Types.ObjectId).toHexString()){
            return res.status(401).json({
                message: "You are not allowed to delete this comment."
            });
        }
        await StoryCommentModel.deleteOne({_id:commentDoc._id});
        article.comments_count -= 1;
        await article.save();
        

        return res.json({
            message: "Comment deleted.",
            comments_count: article.comments_count,
        });

    } catch (error) {
        console.error("Error getting article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



/**
 * @function get_comments_of_the_story
 * @description Place a comment on a story
 */

export async function get_comments_of_the_story(req: Request, res: Response){
    try {
        await ConnectMongoDB();

        const user = get_current_user();
        if (!user) {
            throw new Error("User not found");
        }

        var {story_id, skip, limit} = req.body as {story_id: string, skip?:number, limit?:number};

        // validate request
        if (!story_id || !mongoose.Types.ObjectId.isValid(story_id)){
            return res.status(400).json({message: "story_id is invalid."});
        }
        if (!skip){
            skip = 0;
        }
        if (!limit){
            limit = 25;
        }

        // retrive story article
        const article:any = await ArticleModel.findById(story_id).select(["_id", "comments_count"]);
        if (!article) {
            return res.status(400).json({
                message: "Story article not found"
            });
        }

        // check user has already liked the article
        const user_id = user._id;
        const commentDoc = await StoryCommentModel.find({story_id}).skip(skip).limit(limit).populate("user_id");
        
        let comments:Array<{
            _id: string,
            comment: string,
            reply_to?: any,
            user_id: string,
            user_name: string,
            date_created: string,
        }> = [];

        commentDoc.forEach((comment) => {
            console.log(comment);
            comments.push({
                _id: comment._id.toHexString(),
                comment: comment.comment,
                reply_to: comment.reply_to,
                user_id: (comment.user_id as any)?._id,
                user_name: (comment.user_id as any)?.name??"Anonymous",
                date_created: comment.date_created.toISOString()
            });
        });
        

        return res.json({
            message: "Comment deleted.",
            comments_count: article.comments_count,
            comments,
        });

    } catch (error) {
        console.error("Error getting article", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}