import mongoose from "mongoose";
import CityModel from "./city-model";
import RoleModel from "./role-model";

// 1. Model interface - describing the data:
export interface IUserModel extends mongoose.Document {
    firstName: string;
    lastName: string;
    username: string;
    userId: string;
    password: string;
    city: CityModel;
    street: string;
    role: RoleModel;
}

// 2. Model schema - describing validation, data, constraints...
export const UserSchema = new mongoose.Schema<IUserModel>({
    firstName: {
        type: String, // JavaScript String
        required: [true, "Missing first name"],
        validate: [/^.{2,100}$/s, "'First name' length must be between 2 to 100"]
    },
    lastName: {
        type: String, // JavaScript String
        required: [true, "Missing last name"],
        validate: [/^.{2,100}$/s, "'Last name' length must be between 2 to 100"]
    },
    username: {
        type: String, // JavaScript String
        required: [true, "Missing username"],
        validate: [
            /^(?:[^\W_]\.?){5,29}[^\W_]@[^\W_]+\.([a-zA-Z]{2,3}|([a-zA-Z]{2}\.[a-zA-Z]{2}))$/,
            `\n\n
            'Username' must be a valid email address\n
             Syntax:${'\u00a0'.repeat(35)}username@domain.topLevelDomain
             Example:${'\u00a0'.repeat(34)}william@gmail.com
             Validation rules:${'\u00a0'.repeat(14)}username - 6 to 30 characters(a-z)&/or(0-9) with/without un-consecutive dots(.) in between
             ${'\u00a0'.repeat(42)}at(@)
             ${'\u00a0'.repeat(28)}domain name - (a-z)&/or(0-9)
             ${'\u00a0'.repeat(42)}dot(.)
             ${'\u00a0'.repeat(18)}top-level domain name - (2 to 3 characters(a-z)) or (2 characters(a-z), dot(.), 2 characters(a-z))`
        ],
        set: (username: string) => username.toLowerCase()
    },
    userId: {
        type: String, // JavaScript String
        required: [true, "Missing user id"],
        validate: [/^0*\d{9}$/, "'User id' must be 9 digits"]
    },
    password: {
        type: String, // JavaScript String
        required: [true, "Missing password"],
        validate: [/^.{4,100}$/s, "'Password' length must be between 4 to 100"]
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
    role: { // Create minimum role:
        type: String, // JavaScript String
        default: RoleModel.User,
        set: () => RoleModel.User
    }
}, { // Options
    versionKey: false // Don't add __v for new documents.
});

// 3. Model Class - the final model class:
export const UserModel = mongoose.model<IUserModel>("UserModel", UserSchema, "users"); // Model name, schema name, collection name