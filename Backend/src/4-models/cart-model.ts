import mongoose from "mongoose";
import CartStatusModel from "./cart-status-model";

export interface ICartItem {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
    totalPrice: number;
}

// 1. Model interface - describing the data:
export interface ICartModel extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    creationDate: string;
    items: ICartItem[];
    status: CartStatusModel;
}

const CartItemSchema = new mongoose.Schema<ICartItem>({
    productId: { // Foreign key
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing product id"]
    },
    quantity: {
        type: Number, // JavaScript Number
        required: [true, "Missing quantity"],
        validate: [/^\d*$/, "'Quantity' must be an integer"],
        min: [1, "'Quantity' minimum value is 1"],
        max: [100, "'Quantity' can't exceed 100"]
    },
    totalPrice: {
        type: Number, // JavaScript Number
        required: [true, "Missing total price"],
        min: [0, "'Total price' can't be negative"],
        set: (number: number) => Math.round((number + Number.EPSILON) * 100) / 100
    }
}, { // Options
    _id: false // Don't add _id for new sub-documents.
});

// 2. Model schema - describing validation, data, constraints...
export const CartSchema = new mongoose.Schema<ICartModel>({
    userId: { // Foreign key
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing user id"]
    },
    creationDate: {
        type: String, // JavaScript String
        required: [true, "Missing creation date"]
    },
    items: [CartItemSchema],
    status: {
        type: String, // JavaScript String
        default: CartStatusModel.Open
    }
}, { // Options
    versionKey: false // Don't add __v for new documents.
});

// 3. Model Class - the final model class:
export const CartModel = mongoose.model<ICartModel>("CartModel", CartSchema, "carts"); // Model name, schema name, collection name