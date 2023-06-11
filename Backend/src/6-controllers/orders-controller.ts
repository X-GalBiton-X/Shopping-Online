import express, { NextFunction, Request, Response } from "express";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import { CartModel } from "../4-models/cart-model";
import CartStatusModel from "../4-models/cart-status-model";
import { OrderModel } from "../4-models/order-model";
import { ProductModel } from "../4-models/product-model";
import cartsLogic from "../5-logic/carts-logic";
import ordersLogic from "../5-logic/orders-logic";

const router = express.Router();

// GET http://localhost:3001/api/orders/count
router.get("/orders/count", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const count = await ordersLogic.getOrdersCount();
        response.json(count);
    } catch (err: any) {
        next(err);
    }
});

// POST http://localhost:3001/api/orders
router.post('/orders', verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = response.locals.user._id;
        const cartContent = await CartModel.findOne({ userId, status: CartStatusModel.Open }, ["items"]).exec();
        const cartId = cartContent._id.toString();
        const totalPrice = cartContent.items.reduce((total, entry) => total + entry.totalPrice, 0);

        request.body.userId = userId;
        request.body.cartId = cartId;
        request.body.totalPrice = totalPrice;
        request.body.creationDate = new Date();
        const order = new OrderModel(request.body);
        const addedOrder = await ordersLogic.addOrder(order);
        cartContent.status = CartStatusModel.Closed;
        cartContent.save();
        response.status(201).json({ _id: addedOrder._id });
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/orders/:_id/receipt
router.get('/orders/:_id/receipt', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const cart = await ordersLogic.getCartByOrder(_id);
        const productsObj = {};
        await Promise.all(cart.items.map(async item => {
            const product = await ProductModel.findById(item.productId);
            productsObj[product._id.toString()] = product;
        }));
        let totalPrice = 0;
        let text = cart.items.reduce((allText, item) => {
            const product = productsObj[item.productId.toString()];
            const linePrice = product.price * item.quantity;
            allText += `${product.name} * ${item.quantity} = ${linePrice} NIS\n`;
            totalPrice += linePrice;
            return allText;
        }, '');
        text += 'Total price: ' + totalPrice + ' NIS';
        response.set('Content-Type', 'text/html');
        response.set('Content-Disposition', 'attachment; filename=receipt.txt');
        response.send(text);
    }
    catch (err: any) {
        next(err);
    }
});

// GET http://localhost:3001/api/orders/last
router.get('/orders/last', verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    const userId = response.locals.user._id;
    const openCart = await cartsLogic.getCartByUser(userId);
    if (openCart) {
        response.json({
            openCart: {
                totalPrice: openCart.items.reduce((total, cartEntry) => total + cartEntry.totalPrice, 0),
                date: openCart.creationDate
            }
        });
        return;
    }
    const lastOrder = await ordersLogic.getUserLastOrder(userId);
    if (lastOrder) {
        response.json({
            hasLastOrder: {
                totalPrice: lastOrder.totalPrice,
                date: lastOrder.creationDate
            }
        });
        return;
    }
    response.json({ newCustomer: true });
})

export default router;