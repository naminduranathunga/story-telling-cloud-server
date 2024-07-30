import { Request, Response } from "express";
import mongoose from "mongoose";
import ArticleModel from "../../models/ArticleModel";
import StoryCommentModel from "../../models/StoryComment";
import UserInteractionModel from "../../models/UserInteractionModel";
import ConnectMongoDB from "../../lib/connect_mongodb";
import { get_current_user } from "../../middleware/auth_user";

interface recordInterfaceBody {
    action: string;
    story_id?: string;
    comment_id?: string|mongoose.Types.ObjectId;
    duration?: number;   // for reading
    meta_data?: any;
}

export async function record_user_interactions(req:Request, res:Response) {
    try {
        
        const user = get_current_user();
        if (!user) {
            throw new Error("User not found");
        }

        ConnectMongoDB();

        const { action, story_id, comment_id, duration } = req.body as recordInterfaceBody;
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
        if (!story_id || typeof story_id !== "string" || mongoose.Types.ObjectId.isValid(story_id) === false) {
            return res.status(400).json({
                message: "Story id is required"
            });
        }
        const story = await ArticleModel.findById(story_id);
        if (!story){
            return res.status(400).json({
                message: "Story not found"
            });
        }

        // for comment, comment_id is required
        if (action === "comment") {
            if (!comment_id || typeof comment_id !== "string" || mongoose.Types.ObjectId.isValid(comment_id) === false) {
                return res.status(400).json({
                    message: "Comment id is required"
                });
            }

            // check if the comment exists
            const comment = await StoryCommentModel.findById(comment_id);
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
        add_action_to_db(req.body as recordInterfaceBody, user._id);
        console.log("Interaction recorded");    
        res.json({
            message: "Interaction recorded"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


export async function add_action_to_db(action_object: recordInterfaceBody, user_id: string|mongoose.Types.ObjectId) {
    const { action, story_id, comment_id, duration, meta_data } = action_object;
    const newInt = new UserInteractionModel({
        user_id,
        action,
        story_id,
        comment_id,
        duration,
        meta_data
    });
    
    return await newInt.save();
}

export function get_avaliabe_actions() {
    return ["like", "unlike", "comment", "read"];
}