import { Component, Input } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';

@Component({
    selector: 'product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

    @Input() product!: ProductModel;

    constructor() { }
}