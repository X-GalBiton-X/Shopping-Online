import { RoleModel } from "./role.model";

export class UserModel {
    public _id: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public userId: string;
    public password: string;
    public city: string;
    public street: string;
    public role: RoleModel;
}