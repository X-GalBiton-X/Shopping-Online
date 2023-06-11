import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { HeaderComponent } from './components/layout-area/header/header.component';
import { HomeComponent } from './components/home-area/home/home.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggedOutComponent } from './components/home-area/logged-out/logged-out.component';
import { LoggedInComponent } from './components/home-area/logged-in/logged-in.component';
import { AboutComponent } from './components/home-area/about/about.component';
import { SystemInfoComponent } from './components/home-area/system-info/system-info.component';
import { StepOneComponent } from './components/register-area/step-one/step-one.component';
import { StepTwoComponent } from './components/register-area/step-two/step-two.component';
import { ShopComponent } from './components/shop-area/shop/shop.component';
import { CategoryComponent } from './components/category/category.component';
import { CartComponent } from './components/cart-sidebar/cart.component';
import { ProductPopupComponent } from './components/product-popup/product-popup.component';
import { OrderComponent } from './components/order-area/order/order.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { InterceptorService } from './services/interceptor.service';
import { CartService } from './services/cart.service';
import { initServicesFactory } from './init-services.factory';
import { OrderPopupComponent } from './components/order-area/order-popup/order-popup.component';
import { AdminPageComponent } from './components/admin-area/admin-page/admin-page.component';
import { SidebarComponent } from './components/admin-area/admin-sidebar/sidebar.component';

@NgModule({
    declarations: [
        LayoutComponent,
        HeaderComponent,
        HomeComponent,
        LoggedOutComponent,
        LoggedInComponent,
        AboutComponent,
        SystemInfoComponent,
        StepOneComponent,
        StepTwoComponent,
        ShopComponent,
        CategoryComponent,
        CartComponent,
        ProductPopupComponent,
        OrderComponent,
        ProductCardComponent,
        ProductListComponent,
        OrderPopupComponent,
        AdminPageComponent,
        SidebarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        {
            useClass: InterceptorService,
            provide: HTTP_INTERCEPTORS,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initServicesFactory,
            deps: [CartService],
            multi: true
        }
    ],
    bootstrap: [LayoutComponent]
})
export class AppModule { }
