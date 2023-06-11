import { CartModel, ICartItem, ICartModel } from "../4-models/cart-model";
import CartStatusModel from "../4-models/cart-status-model";
import { ClientError, ForbiddenError } from "../4-models/client-errors";
import { IProductModel, ProductModel } from "../4-models/product-model";

// Get user cart:
async function getUserCartEntries(userId: string): Promise<Array<{ product: IProductModel, quantity: number }>> {
    const existingCart = await CartModel.findOne({ userId, status: CartStatusModel.Open }).exec();
    if (!existingCart) return [];

    return Promise.all(existingCart.items.map(async item => {
        const product = await ProductModel.findById(item.productId).exec();
        return {
            product,
            quantity: item.quantity
        }
    }));
}

async function getCartByUser(userId: string): Promise<ICartModel> {
    return CartModel.findOne({ userId, status: CartStatusModel.Open }).exec();
}

// Add item to existing cart OR create new cart and add it's first item:
async function addItem(userId: string, item: ICartItem): Promise<ICartModel> {

    // Calculate item's total price:
    const requiredProduct = await ProductModel.findById(item.productId);
    item.totalPrice = requiredProduct.price * item.quantity;

    // Check if cart exists:
    const existingCart = await CartModel.findOne({ userId, status: CartStatusModel.Open }).exec();

    // If cart exists:
    if (existingCart) {
        let existingItemFound = false;

        // Update cart's items:
        existingCart.items = existingCart.items.map(i => {

            // Update item:
            if (i.productId.toString() === item.productId.toString()) {
                existingItemFound = true;
                return {
                    ...i,
                    quantity: i.quantity + item.quantity,
                    totalPrice: i.totalPrice + item.totalPrice
                }
            }

            // Keep the other items, as they are:
            return i;
        });

        // If item did not exist, add item:
        if (!existingItemFound) {
            existingCart.items.push(item);
        }

        // Return cart:
        return existingCart.save();
    }

    // If cart doesn't exist, create new cart and add it's first item:
    return CartModel.create({ userId, creationDate: new Date(), items: [item] });
}

// Remove item from existing cart:
async function removeItem(userId: string, productId: string): Promise<void> {

    // Check if cart exists:
    const existingCart = await CartModel.findOne({ userId, status: CartStatusModel.Open }).exec();

    // If cart exists:
    if (existingCart) {
        let existingItemFound = false;
        let existingItemIndex = null;

        // Update cart's items:
        existingCart.items = existingCart.items.map((i, currentIndex) => {

            // Find item to remove:
            if (i.productId.toString() === productId) {
                existingItemFound = true;
                existingItemIndex = currentIndex;
            }

            // Keep all the items, as they are:
            return i;
        });

        // If item has been found:
        if (existingItemFound) {
            existingCart.items.splice(existingItemIndex, 1); // Remove item.
        }

        // If item has not been found:
        else throw new ClientError(404, `product id ${productId} not found`);

        // Update cart:
        if (existingCart.items.length) {
            await existingCart.save();
        }

        // If cart is empty, delete it:
        else existingCart.delete();
    }

    // If cart doesn't exist:
    else throw new ForbiddenError(`No available cart associated with user id ${userId} has been found`);
}

// Delete cart:
async function deleteCart(userId: string): Promise<void> {
    const deletedCart = await CartModel.findOneAndDelete({ userId, status: CartStatusModel.Open }).exec();
    if (!deletedCart) throw new ForbiddenError(`No available cart associated with user id ${userId} has been found`);
}

export default {
    getUserCartEntries,
    getCartByUser,
    addItem,
    removeItem,
    deleteCart
};