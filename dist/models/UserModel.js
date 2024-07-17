"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * A mongodb user model
 *      - collection: User
 *
 */
const userSchema = new mongoose_1.Schema({
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
        followers: Number,
    }
});
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
