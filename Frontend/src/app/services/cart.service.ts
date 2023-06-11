import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../models/product.model';
import { CartAction, CartActionType, cartStore, ICartEntry } from '../redux/cart.state';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    constructor(private http: HttpClient) { }

    async init(): Promise<void> {
        const cartContent = await firstValueFrom(this.http.get(environment.cartsUrl)) as Array<ICartEntry>;
        cartContent.forEach(cartItem => {
            const action: CartAction = { type: CartActionType.Add, product: cartItem.product, quantity: cartItem.quantity };
            cartStore.dispatch(action);
        });
        const lastOrderStatus = await firstValueFrom(this.http.get(environment.ordersUrl + 'last'));
        cartStore.dispatch({ type: CartActionType.SetLastOrderStatus, lastOrderStatus });
    }

    // Add item:
    async addItem(item: ICartEntry): Promise<void> {
        await firstValueFrom(this.http.put(environment.cartsUrl + "add-item", { productId: item.product._id, quantity: item.quantity }));
        const action: CartAction = { type: CartActionType.Add, product: item.product, quantity: item.quantity };
        cartStore.dispatch(action);
    }

    // Remove item:
    async removeItem(product: ProductModel): Promise<void> {
        await firstValueFrom(this.http.put(environment.cartsUrl + `remove-item/${product._id}`, null));
    }

    // Delete cart:
    async deleteCart(): Promise<void> {
        await firstValueFrom(this.http.delete(environment.cartsUrl));
        const action: CartAction = { type: CartActionType.RemoveAll };
        cartStore.dispatch(action);
    }

}