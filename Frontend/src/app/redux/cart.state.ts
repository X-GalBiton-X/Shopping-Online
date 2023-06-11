import { createStore } from "redux";
import { ProductModel } from '../models/product.model';

export interface ICartEntry {
    product: ProductModel;
    quantity: number;
}

export class CartState {
    
    public cartContent: ICartEntry[];
    public selectedProduct: ProductModel;
    public lastOrderStatus: Record<string, any> = {};

    public constructor() {
        this.cartContent = [];
    }
}

export enum CartActionType {
    PromptAdd,
    Add,
    Remove,
    RemoveAll,
    SetLastOrderStatus
}

export interface CartAction {
    type: CartActionType;
    product?: ProductModel;
    quantity?: number;
    lastOrderStatus?: Record<string, any>;
}

export function cartReducer(currentState = new CartState(), action: CartAction): CartState {

    const newState = { ...currentState };

    switch (action.type) {
        case CartActionType.PromptAdd:
            newState.selectedProduct = action.product;
            break;
        case CartActionType.Add: 
            newState.selectedProduct = null;
            const ind = currentState.cartContent.findIndex(entry => entry.product._id === action.product._id);
            if (ind !== -1) {
                newState.cartContent = [
                    ...currentState.cartContent.slice(0, ind),
                    { ...currentState.cartContent[ind], quantity: currentState.cartContent[ind].quantity + action.quantity },
                    ...currentState.cartContent.slice(ind + 1)
                ];
            } else {
                newState.cartContent = [...currentState.cartContent, { product: action.product, quantity: action.quantity }];
            }
            break;
        case CartActionType.Remove:
            newState.cartContent = currentState.cartContent.filter(entry => entry.product._id !== action.product._id);
            break;
        case CartActionType.RemoveAll:
            newState.cartContent = [];
            break;
        case CartActionType.SetLastOrderStatus:
            newState.lastOrderStatus = action.lastOrderStatus;
            break;
    }

    return newState;
}

export const cartStore = createStore(cartReducer);