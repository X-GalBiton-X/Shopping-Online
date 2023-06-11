import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscribe } from 'redux';
import { cartStore } from 'src/app/redux/cart.state';

@Component({
    selector: 'app-logged-in',
    templateUrl: './logged-in.component.html',
    styleUrls: ['./logged-in.component.css']
})
export class LoggedInComponent implements OnInit, OnDestroy {

    public isNewOrder: boolean;
    private unsubscribe: Unsubscribe;

    public ngOnInit(): void {
        this.setIsNewOrder();
        this.unsubscribe = cartStore.subscribe(() => {
            this.setIsNewOrder();
        });
    }

    private setIsNewOrder(): void {
        this.isNewOrder = !cartStore.getState().lastOrderStatus['openCart'];
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

}