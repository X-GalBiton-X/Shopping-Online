import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";
import { CategoryModel } from "./category-model";

// 1. Model interface - describing the data:
export interface IProductModel extends mongoose.Document {
    name: string;
    categoryId: mongoose.Schema.Types.ObjectId; // Foreign key
    price: number;
    image: UploadedFile;
    imageName: string;
}

// 2. Model schema - describing validation, data, constraints...
export const ProductSchema = new mongoose.Schema<IProductModel>({
    name: {
        type: String, // JavaScript String
        required: [true, "Missing name"],
        validate: [/^.{2,100}$/s, "'Name' length must be between 2 to 100"]
    },
    categoryId: { // Foreign key
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing category id"]
    },
    price: {
        type: Number, // JavaScript Number
        required: [true, "Missing price"],
        min: [0, "'Price' can't be negative"],
        max: [1000, "'Price' can't exceed 1000"]
    },
    image: {
        type: Object, // JavaScript Object
        required: [true, "Missing image"]
    },
    imageName: String // JavaScript String
}, { // Options
    versionKey: false, // Don't add __v for new documents.
    toJSON: { virtuals: true },
    id: false
});

ProductSchema.virtual("category", {
    ref: CategoryModel,
    localField: "categoryId",
    foreignField: "_id",
    justOne: true
});

// 3. Model Class - the final model class:
export const ProductModel = mongoose.model<IProductModel>("ProductModel", ProductSchema, "products"); // Model name, schema name, collection name