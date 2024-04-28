import { Schema, model } from "mongoose";


/**
 * A mongodb user model 
 *      - collection: User
 * 
 */
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    is_verified: Boolean,
    profile: {
        cover_image: String,
        profile_image: String,
        description: String,
    }
});

const UserModel = model('User', userSchema);
export default UserModel;