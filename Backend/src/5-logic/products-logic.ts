import { v4 as uuid } from "uuid";
import safeDelete from "../2-utils/safe-delete";
import { CategoryModel, ICategoryModel } from "../4-models/category-model";
import { IdNotFoundError, ValidationError } from "../4-models/client-errors";
import { IProductModel, ProductModel } from "../4-models/product-model";

// Get products count:
async function getProductsCount(): Promise<number> {
    return ProductModel.find().count().exec();
}

// Get all categories:
async function getAllCategories(): Promise<ICategoryModel[]> {
    return CategoryModel.find().exec();
}

// Get products by category:
async function getProductsByCategory(categoryId: string): Promise<IProductModel[]> {
    return ProductModel.find({ categoryId }).populate("category", "-_id").exec();
}

// Get products by search:
async function getProductsBySearch(searchValue: string): Promise<IProductModel[]> {
    return ProductModel.find({ name: new RegExp('^' + searchValue, "i") }).exec();
}

// Add product:
async function addProduct(product: IProductModel): Promise<IProductModel> {

    // Validate:
    const errors = product.validateSync();
    if (errors) throw new ValidationError(errors.message);

    // If image file is given:
    if (product.image) {
        const extension = product.image.name.substring( // Extract extension --> .gif / .png / .jpg / .jpeg
            product.image.name.lastIndexOf(".")
        );
        product.imageName = uuid() + extension; // Create image name.
        await product.image.mv("./src/1-assets/images/" + product.imageName); // Copy image onto HardDisk.
        product.image = undefined; // Delete File before saving.
    }

    // Insert new product into database:
    return product.save({ validateBeforeSave: false });
}

// Update product:
async function updateProduct(product: IProductModel): Promise<IProductModel> {

    // If image file is given:
    if (product.image) {
        await safeDelete("./src/1-assets/images/" + product.imageName); // Check and delete previous image.
        const extension = product.image.name.substring( // Extract extension --> .gif / .png / .jpg / .jpeg
            product.image.name.lastIndexOf(".")
        );
        product.imageName = uuid() + extension; // Create image name.
        await product.image.mv("./src/1-assets/images/" + product.imageName); // Copy image onto HardDisk.
        product.image = undefined; // Delete File before saving.
    }

    // Check if given _id exists in database and get result:
    const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec(); // { returnOriginal: false } --> return back db product and not argument product.

    // If no such _id exists:
    if (!updatedProduct) throw new IdNotFoundError(product._id);

    return updatedProduct;
}

export default {
    getProductsCount,
    getAllCategories,
    getProductsByCategory,
    getProductsBySearch,
    addProduct,
    updateProduct
};