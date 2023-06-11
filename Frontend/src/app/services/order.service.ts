import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderModel } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private http: HttpClient) { }

    // Get orders count:
    async getOrdersCount(): Promise<number> {
        return await firstValueFrom(this.http.get<number>(environment.ordersUrl + "count"));
    }

    // Add order:
    async addOrder(order: OrderModel): Promise<string> {
        const created = await firstValueFrom(this.http.post<OrderModel>(environment.ordersUrl, order));
        return created._id;
    }
}
