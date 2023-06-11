import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';
import { cartStore } from 'src/app/redux/cart.state';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-system-info',
    templateUrl: './system-info.component.html',
    styleUrls: ['./system-info.component.css']
})
export class SystemInfoComponent implements OnInit, OnDestroy {

    public numberOfProducts: number;
    public numberOfOrders: number;
    public user: UserModel;
    public lastOrderStatus: Record<string, any>;
    private unsubscribeAuth: Unsubscribe;
    private unsubscribeCart: Unsubscribe;

    constructor(private productsService: ProductsService, private orderService: OrderService) { }

    public async ngOnInit() {
        this.user = authStore.getState().user;
        this.unsubscribeAuth = authStore.subscribe(() => {
            this.user = authStore.getState().user;
        });
        this.lastOrderStatus = cartStore.getState().lastOrderStatus;
        this.unsubscribeCart = cartStore.subscribe(() => {
            this.lastOrderStatus = cartStore.getState().lastOrderStatus;
        });
        try {
            this.numberOfProducts = await this.productsService.getProductsCount();
            this.numberOfOrders = await this.orderService.getOrdersCount();
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    public formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    public ngOnDestroy(): void {
        this.unsubscribeAuth();
        this.unsubscribeCart();
    }

}