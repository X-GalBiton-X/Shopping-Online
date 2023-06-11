import mongoose from "mongoose";

// 1. Model interface - describing the data:
export interface ICategoryModel extends mongoose.Document {
    name: string;
}

// 2. Model schema - describing validation, data, constraints...
export const CategorySchema = new mongoose.Schema<ICategoryModel>({
    name: String // JavaScript String
});

// 3. Model Class - the final model class:
export const CategoryModel = mongoose.model<ICategoryModel>("CategoryModel", CategorySchema, "categories"); // Model name, schema name, collection name