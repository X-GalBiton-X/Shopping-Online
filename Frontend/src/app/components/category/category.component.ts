import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductModel } from 'src/app/models/product.model';
import { authStore } from 'src/app/redux/auth.state';
import { cartStore, CartActionType } from 'src/app/redux/cart.state';

@Component({
    selector: 'category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

    public products: ProductModel[];

    constructor(private route: ActivatedRoute) { }

    public async ngOnInit(): Promise<void> {
        this.route.paramMap.subscribe(async (params: ParamMap) => {
            const categoryId = params.get('id');
            const response = await fetch(`http://localhost:3001/api/products-by-category/${categoryId}`, {
                headers: {
                    Authorization: `bearer ${authStore.getState().token}`
                }
            });
            this.products = await response.json();
        })
    }

    public promptProductAdd(product: ProductModel) {
        cartStore.dispatch({ type: CartActionType.PromptAdd, product });
    }
}