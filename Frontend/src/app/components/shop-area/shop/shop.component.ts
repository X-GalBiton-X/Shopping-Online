import { Component, OnInit, OnDestroy } from '@angular/core';
import { Unsubscribe } from 'redux';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { productsStore } from 'src/app/redux/products.state';
import { cartStore, CartActionType } from 'src/app/redux/cart.state';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {

    public categories: CategoryModel[];
    public searchedProducts: ProductModel[];
    public searchQuery: string;
    private unsubscribe: Unsubscribe;

    constructor(private productsService: ProductsService) { }

    public ngOnInit(): void {
        const productsState = productsStore.getState();
        this.categories = productsState.categories;
        this.searchedProducts = productsState.searchedProducts;
        this.unsubscribe = productsStore.subscribe(() => {
            const productsState = productsStore.getState();
            this.categories = productsState.categories;
            this.searchedProducts = productsState.searchedProducts;
        });
        this.productsService.getAllCategories();
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

    public onSearchChanged(value: string) {
        this.searchQuery = value;
        if (value) {
            this.productsService.getProductsBySearch(value);
        } else {
            this.productsService.clearProductsSearch();
        }
    }

    public onProductSelected(product: ProductModel): void {
        cartStore.dispatch({ type: CartActionType.PromptAdd, product });
    }
}