import { Schema, Types, model } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});

const CategoryModel = model('Category', CategorySchema);
export default CategoryModel;