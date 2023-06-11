import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { MidRegisterModel } from '../models/mid-register.model';
import { UserModel } from '../models/user.model';
import { AuthAction, AuthActionType, authStore } from '../redux/auth.state';
import { CartAction, CartActionType, cartStore } from '../redux/cart.state';
import { CartService } from './cart.service';
import { OrderService } from './order.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public midRegister: MidRegisterModel;

    constructor(private http: HttpClient, private cartService: CartService, private orderService: OrderService) { }

    // Register:
    async register(user: UserModel): Promise<void> {
        const observable = this.http.post<string>(environment.authUrl + 'register', user);
        const token = await firstValueFrom(observable);
        const action: AuthAction = { type: AuthActionType.Register, payload: token };
        authStore.dispatch(action);
    }
    
    // Login:
    async login(credentials: CredentialsModel): Promise<void> {
        const observable = this.http.post<string>(environment.authUrl + 'login', credentials);
        const token = await firstValueFrom(observable);
        const action: AuthAction = { type: AuthActionType.Login, payload: token };
        authStore.dispatch(action);
        this.cartService.init();
    }
    
    // Logout:
    logout(): void {
        const authAction: AuthAction = { type: AuthActionType.Logout };
        const cartAction: CartAction = { type: CartActionType.RemoveAll };
        authStore.dispatch(authAction);
        cartStore.dispatch(cartAction);
    }

    // Get all cities:
    async getAllCities(): Promise<object> {
        const observable = this.http.get<object>(environment.authUrl + 'cities');
        return await firstValueFrom(observable);
    }

}