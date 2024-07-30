import { Schema, Types, model } from "mongoose";

const UserInteractionSchema = new Schema({
    user_id: {
        type: Types.ObjectId,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    story_id: {
        type: Types.ObjectId,
        required: false
    },
    comment_id: {
        type: Types.ObjectId
    },
    duration: {
        type: Number
    },
    meta_data: {
        type: Schema.Types.Map
    }

});

const UserInteractionModel = model('UserInteraction', UserInteractionSchema);
export default UserInteractionModel;