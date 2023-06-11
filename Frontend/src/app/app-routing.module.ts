import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home-area/home/home.component';
import { StepOneComponent } from './components/register-area/step-one/step-one.component';
import { StepTwoComponent } from './components/register-area/step-two/step-two.component';
import { ShopComponent } from './components/shop-area/shop/shop.component';
import { CategoryComponent } from './components/category/category.component';
import { OrderComponent } from './components/order-area/order/order.component';
import { AdminPageComponent } from './components/admin-area/admin-page/admin-page.component';

const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "step-one", component: StepOneComponent },
    { path: "step-two", component: StepTwoComponent },
    {
        path: "shop", component: ShopComponent,
        children: [
            {
                path: 'category/:id',
                component: CategoryComponent
            }
        ]
    },
    { path: "order", component: OrderComponent },
    {
        path: "admin-page", component: AdminPageComponent,
        children: [
            {
                path: 'category/:id',
                component: CategoryComponent
            }
        ]
    },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    // { path: "**", component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
