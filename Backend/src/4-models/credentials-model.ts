import mongoose from "mongoose";

// 1. Model interface - describing the data:
export interface ICredentialsModel extends mongoose.Document {
    username: string;
    password: string;
}

// 2. Model schema - describing validation, data, constraints...
export const CredentialsSchema = new mongoose.Schema<ICredentialsModel>({
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
    password: {
        type: String, // JavaScript String
        required: [true, "Missing password"],
        validate: [/^.{4,100}$/s, "'Password' length must be between 4 to 100"]
    }
});

// 3. Model Class - the final model class:
export const CredentialsModel = mongoose.model<ICredentialsModel>("CredentialsModel", CredentialsSchema, "users"); // Model name, schema name, collection name