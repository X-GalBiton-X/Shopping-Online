import { CategoryModel } from "./category.model";

export class ProductModel {
    public _id: string;
    public name: string;
    public categoryId: string;
    public price: number;
    public image: File;
    public imageName: string;
    public category: CategoryModel;
}