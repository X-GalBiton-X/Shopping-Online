import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../models/product.model';
import { CategoryModel } from '../models/category.model';
import { ProductsAction, ProductsActionType, productsStore } from '../redux/products.state';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    constructor(private http: HttpClient) { }

    // Get products count:
    async getProductsCount(): Promise<number> {
        return await firstValueFrom(this.http.get<number>(environment.productsUrl + "count"));
    }

    // Get all categories:
    async getAllCategories(): Promise<void> {
        const categories = await firstValueFrom(this.http.get<CategoryModel[]>(environment.categoriesUrl));
        const action: ProductsAction = { type: ProductsActionType.FetchCategories, payload: categories };
        productsStore.dispatch(action);
    }
    
    // Get products by category:
    async getProductsByCategory(categoryId: string): Promise<void> {
        const productsByCategory = await firstValueFrom(this.http.get<ProductModel[]>(environment.productsByCategoryUrl + categoryId));
        const action: ProductsAction = { type: ProductsActionType.FetchProducts, payload: productsByCategory };
        productsStore.dispatch(action);
    }

    // Get products by search:
    async getProductsBySearch(searchValue: string): Promise<void> {
        const searchedProducts = await firstValueFrom(this.http.get<ProductModel[]>(environment.productsBySearchUrl + searchValue));
        const action: ProductsAction = { type: ProductsActionType.SearchProducts, payload: searchedProducts };
        productsStore.dispatch(action);
    }

    clearProductsSearch(): void {
        const action: ProductsAction = { type: ProductsActionType.SearchProducts, payload: [] };
        productsStore.dispatch(action);
    }

    async addProduct(product: Partial<ProductModel>): Promise<void> {
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("categoryId", product.categoryId);
        formData.append("price", product.price.toString());
        formData.append("image", product.image);

        await firstValueFrom(this.http.post<Partial<ProductModel>>(environment.productsUrl, formData));
    }

    async updateProduct(product: Partial<ProductModel>): Promise<void> {
        await firstValueFrom(this.http.put<Partial<ProductModel>>(environment.productsUrl + product._id, product));
    }

}