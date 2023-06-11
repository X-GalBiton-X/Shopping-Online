import { createStore } from "redux";
import { CategoryModel } from "../models/category.model";
import { ProductModel } from "../models/product.model";

export class ProductsState {
    public categories: CategoryModel[] = [];
    public products: ProductModel[] = [];
    public searchedProducts: ProductModel[] = [];
}

export enum ProductsActionType {
    FetchCategories,
    FetchProducts,
    SearchProducts
}

export interface ProductsAction {
    type: ProductsActionType;
    payload: any;
}

export function productsReducer(currentState = new ProductsState(), action: ProductsAction): ProductsState {

    const newState = { ...currentState };

    switch (action.type) {
        case ProductsActionType.FetchCategories:
            newState.categories = action.payload;
            break;

        case ProductsActionType.FetchProducts:
            newState.products = action.payload;
            break;

        case ProductsActionType.SearchProducts:
            newState.searchedProducts = action.payload;
            break;
    }

    return newState;
}

export const productsStore = createStore(productsReducer);