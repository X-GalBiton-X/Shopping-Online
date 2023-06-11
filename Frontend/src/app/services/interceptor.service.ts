import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authStore } from '../redux/auth.state';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (authStore.getState().token) {
            request = request.clone({
                setHeaders: {
                    authorization: "Bearer " + authStore.getState().token
                }
            });
        }
        return next.handle(request);
    }
}
