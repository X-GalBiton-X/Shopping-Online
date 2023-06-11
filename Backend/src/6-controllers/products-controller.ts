import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../3-middleware/verify-admin";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import { ProductModel } from "../4-models/product-model";
import productsLogic from "../5-logic/products-logic";

const router = express.Router();

// GET http://localhost:3001/api/products/count
router.get("/products/count", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const count = await productsLogic.getProductsCount();
        response.json(count);
    } catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/categories
router.get("/categories", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categories = await productsLogic.getAllCategories();
        response.json(categories);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/products-by-category/:categoryId
router.get("/products-by-category/:categoryId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categoryId = request.params.categoryId;
        const products = await productsLogic.getProductsByCategory(categoryId);
        response.json(products);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/products-by-search/:searchValue
router.get("/products-by-search/:searchValue", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const searchValue = request.params.searchValue;
        const searchedProducts = await productsLogic.getProductsBySearch(searchValue);
        response.json(searchedProducts);
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://localhost:3001/api/products
router.post("/products", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const product = new ProductModel(request.body);
        const addedProduct = await productsLogic.addProduct(product);
        response.status(201).json(addedProduct);
    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:3001/api/products/:_id
router.put("/products/:_id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const _id = request.params._id;
        request.body._id = _id;
        const product = request.body;
        const updatedProduct = await productsLogic.updateProduct(product);
        response.json(updatedProduct);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;