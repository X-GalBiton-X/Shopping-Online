import auth from "../2-utils/auth";
import { UnauthorizedError, ValidationError } from "../4-models/client-errors";
import hash from "../2-utils/cyber";
import { IUserModel, UserModel } from "../4-models/user-model";
import { ICredentialsModel } from "../4-models/credentials-model";

// Register:
async function register(user: IUserModel): Promise<string> { // Returning a new token

    // Validate:
    const errors = user.validateSync();
    if (errors) throw new ValidationError(errors.message);

    // Delete user id from mongoose document (from system):
    user.userId = undefined;

    // Check if username is registered:
    const existingUsername = await isExistingUsername(user.username);
    if (existingUsername) throw new UnauthorizedError("This username is already taken");

    // Hash the given password: 
    user.password = hash(user.password);

    // Insert new user into database:
    user.save({ validateBeforeSave: false });

    // Delete password from user object (for token):
    user = user.toObject();
    delete user.password;

    // Generate new token:
    const token = auth.generateNewToken(user);

    return token;
}

// Login:
async function login(credentials: ICredentialsModel): Promise<string> {

    // Validate:
    const errors = credentials.validateSync();
    if (errors) throw new ValidationError(errors.message);

    // Hash the given password: 
    credentials.password = hash(credentials.password);

    // Check if user exists and get result:
    const users = await UserModel.find({ username: credentials.username, password: credentials.password }, { password: false }).exec();
    const user = users[0];
    
    // If no such user exists:
    if (!user) throw new UnauthorizedError("Incorrect username or password");

    // Generate new token:
    const token = auth.generateNewToken(user);

    return token;
}

// Check if given username already exists:
async function isExistingUsername(username: string): Promise<number> {
    const result = await UserModel.find({ username: username }, { username: true, _id: false }).exec();
    return result.length;
}

export default {
    register,
    login,
    isExistingUsername
};