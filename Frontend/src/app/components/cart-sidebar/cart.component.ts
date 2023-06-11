import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { ProductModel } from 'src/app/models/product.model';
import { cartStore, CartActionType, ICartEntry } from 'src/app/redux/cart.state';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit, OnDestroy {

    public cartContent: ICartEntry[];
    private unsubscribe: Unsubscribe;

    constructor(private cartService: CartService, private router: Router) { }

    public async ngOnInit(): Promise<void> {
        this.cartContent = cartStore.getState().cartContent;
        this.unsubscribe = cartStore.subscribe(() => {
            this.cartContent = cartStore.getState().cartContent;
        });
    }

    public removeFromCart(product: ProductModel) {
        this.cartService.removeItem(product);
        cartStore.dispatch({ type: CartActionType.Remove, product });
    }

    public clearCart(): void {
        this.cartService.deleteCart();
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

    public getTotal(): number {
        return this.cartContent.reduce((total, entry) => total + entry.product.price * entry.quantity, 0);
    }

    public order(): void {
        try {
            if (!this.cartContent.length) {
                alert("Your cart is empty..");
                return;
            }
            this.router.navigateByUrl("/order");
        }
        catch (err: any) {
            alert(err.message);
        }
    }
}