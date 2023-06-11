import { IUserModel } from "../4-models/user-model";
import RoleModel from "../4-models/role-model";
import jwt from "jsonwebtoken";

const secretKey = "Gal'sOnlineShopping";

function generateNewToken(user: IUserModel): string {
    const container = { user };
    const token = jwt.sign(container, secretKey, { expiresIn: "2h" });
    return token;
}

function verifyToken(authHeader: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            if (!authHeader) {
                resolve(false);
                return;
            }
            const token = authHeader.substring(7);
            if (!token) {
                resolve(false);
                return;
            }
            jwt.verify(token, secretKey, err => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        }
        catch (err: any) {
            reject(err);
        }
    });
}

function getUserRoleFromToken(authHeader: string): RoleModel {
    const token = authHeader.substring(7);
    const container = jwt.decode(token) as { user: IUserModel };
    const user = container.user;
    const role = user.role;
    return role;
}

function getUserFromToken(authHeader: string): IUserModel {
    const token = authHeader.substring(7);
    const container = jwt.decode(token) as { user: IUserModel };
    return container.user;
}

export default {
    generateNewToken,
    verifyToken,
    getUserRoleFromToken,
    getUserFromToken
};