import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Unsubscribe } from 'redux';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { CartActionType, cartStore } from 'src/app/redux/cart.state';
import { productsStore } from 'src/app/redux/products.state';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

    public categories: CategoryModel[];
    public newProduct: Partial<ProductModel>;
    public editedProduct: Partial<ProductModel>;
    public selectedProduct: ProductModel;
    private cartUnsubscribe: Unsubscribe;
    private productsUnsubscribe: Unsubscribe;

    @ViewChild("productImage")
    public productImage: ElementRef<HTMLInputElement>;

    constructor(private productsService: ProductsService) { }

    public async ngOnInit() {
        this.selectedProduct = cartStore.getState().selectedProduct;
        this.cartUnsubscribe = cartStore.subscribe(() => {
            this.selectedProduct = cartStore.getState().selectedProduct;
            this.editedProduct = this.selectedProduct;
            this.newProduct = null;
        });
        this.categories = productsStore.getState().categories;
        this.productsUnsubscribe = productsStore.subscribe(() => {
            this.categories = productsStore.getState().categories;
        });
    }

    public ngOnDestroy(): void {
        this.cartUnsubscribe();
        this.productsUnsubscribe();
    }

    public save(): void {
        if (this.newProduct) {
            this.newProduct.image = this.productImage.nativeElement.files.item(0);
            this.productsService.addProduct(this.newProduct);
        } else {
            this.editedProduct.image = this.productImage.nativeElement.files.item(0);
            this.productsService.updateProduct(this.editedProduct);
        }
        this.newProduct = null;
        cartStore.dispatch({ type: CartActionType.PromptAdd, product: null });
    }

    public setNewProduct() {
        this.newProduct = {};
        this.editedProduct = this.newProduct;
    }
}
