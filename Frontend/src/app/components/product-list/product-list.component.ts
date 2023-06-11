import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';


@Component({
    selector: 'product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
    @Input()
    public products!: ProductModel[];

    @Output() 
    selected = new EventEmitter<ProductModel>();
}