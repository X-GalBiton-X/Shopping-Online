import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-order-popup',
    templateUrl: './order-popup.component.html',
    styleUrls: ['./order-popup.component.css']
})
export class OrderPopupComponent implements OnChanges{

    @Input()
    public open: boolean;
    
    @Input()
    public orderId: string;

    public receiptDownloadUrl: string;

    constructor() { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['orderId']?.currentValue) {
            this.receiptDownloadUrl = `${environment.ordersUrl}${changes['orderId'].currentValue}/receipt`;
        }
    }
}
