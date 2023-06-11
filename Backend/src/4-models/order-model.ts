import mongoose from "mongoose";
import CityModel from "./city-model";

// 1. Model interface - describing the data:
export interface IOrderModel extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    cartId: mongoose.Schema.Types.ObjectId;
    totalPrice: number;
    city: CityModel;
    street: string;
    shippingDate: string;
    creationDate: string;
    lastFourDigits: string;
}

// 2. Model schema - describing validation, data, constraints...
export const OrderSchema = new mongoose.Schema<IOrderModel>({
    userId: { // Foreign key
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing user id"]
    },
    cartId: { // Foreign key
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Missing cart id"]
    },
    totalPrice: {
        type: Number, // JavaScript Number
        required: [true, "Missing price"],
        min: [0, "'Price' can't be negative"]
    },
    city: {
        type: String, // JavaScript String
        required: [true, "Missing city"],
        enum: {
            values: Object.values(CityModel),
            message: "'City' must be one of the following values:\n\n" +
                Object.values(CityModel).join("\n")
        }
    },
    street: {
        type: String, // JavaScript String
        required: [true, "Missing street"],
        validate: [/^.{2,100}$/s, "'Street' length must be between 2 to 100"]
    },
    shippingDate: {
        type: String, // JavaScript String
        required: [true, "Missing shipping date"]
    },
    creationDate: {
        type: String, // JavaScript String
        required: [true, "Missing creation date"]
    },
    lastFourDigits: {
        type: String, // JavaScript String
        required: [true, "Missing last four digits of credit card"],
        validate: [/^\d{4}$/, "'Last four digits' must be 4 digits"]
    }
}, { // Options
    versionKey: false // Don't add __v for new documents.
});

// 3. Model Class - the final model class:
export const OrderModel = mongoose.model<IOrderModel>("OrderModel", OrderSchema, "orders"); // Model name, schema name, collection name