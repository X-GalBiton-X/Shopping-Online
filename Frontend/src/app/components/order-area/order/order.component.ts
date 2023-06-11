import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Unsubscribe } from 'redux';
import { AuthService } from 'src/app/services/auth.service';
import { CartActionType, cartStore, ICartEntry } from 'src/app/redux/cart.state';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';
import { OrderModel } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

    public cartContent: ICartEntry[];
    public user: UserModel;
    public cities: object;
    public order = new OrderModel();
    public orderId: string;
    public creditCard: string;
    private cartUnsubscribe: Unsubscribe;
    private userUnsubscribe: Unsubscribe;

    @Input()
    public open: boolean = false;

    constructor(private authService: AuthService, private orderService: OrderService) { }

    public async ngOnInit(): Promise<void> {
        this.cartContent = cartStore.getState().cartContent;
        this.user = authStore.getState().user;
        this.cartUnsubscribe = cartStore.subscribe(() => {
            this.cartContent = cartStore.getState().cartContent;
        });
        this.userUnsubscribe = authStore.subscribe(() => {
            this.user = authStore.getState().user;
        });
        try {
            this.cities = await this.authService.getAllCities();
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    public ngOnDestroy(): void {
        this.cartUnsubscribe();
        this.userUnsubscribe();
    }

    public setUserStreetToDefault(): void {
        this.order.street = this.user.street;
    }

    public setUserCityToDefault(): void {
        this.order.city = this.user.city;
    }

    public async send() {
        try {
            this.order.lastFourDigits = this.creditCard.slice(-4);
            this.orderId = await this.orderService.addOrder(this.order);
            this.open = true;
            cartStore.dispatch({ type: CartActionType.RemoveAll });
        }
        catch (err: any) {
            alert(err.message);
        }
    }

}
