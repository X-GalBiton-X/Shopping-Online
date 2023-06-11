import { Component, OnInit, OnDestroy } from '@angular/core';
import { Unsubscribe } from 'redux';
import { ProductModel } from 'src/app/models/product.model';
import { cartStore } from 'src/app/redux/cart.state';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'product-popup',
    templateUrl: './product-popup.component.html',
    styleUrls: ['./product-popup.component.css']
})
export class ProductPopupComponent implements OnInit, OnDestroy {

    public selectedProduct: ProductModel;
    public quantity: number;
    private unsubscribe: Unsubscribe;

    constructor(private cartService: CartService) { }

    public ngOnInit(): void {
        this.quantity = 1;
        this.selectedProduct = cartStore.getState().selectedProduct;
        this.unsubscribe = cartStore.subscribe(() => {
            this.quantity = 1;
            this.selectedProduct = cartStore.getState().selectedProduct;
        });
    }

    public decrease(): void {
        this.quantity = this.quantity > 1 ? this.quantity - 1 : this.quantity;
    }

    public increase(): void {
        this.quantity++;
    }

    public addToCart(): void {
        this.cartService.addItem({ product: this.selectedProduct, quantity: this.quantity });
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

}