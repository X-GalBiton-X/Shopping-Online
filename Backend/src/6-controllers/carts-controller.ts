import express, { NextFunction, Request, Response } from "express";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import { ICartItem } from "../4-models/cart-model";
import cartsLogic from "../5-logic/carts-logic";

const router = express.Router();
// GET http://localhost:3001/api/carts
router.get('/carts', verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = response.locals.user._id;
        const cart = await cartsLogic.getUserCartEntries(userId);
        response.json(cart);
    } catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:3001/api/carts/add-item
router.put("/carts/add-item", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = response.locals.user._id;
        const item: ICartItem = request.body;
        const cart = await cartsLogic.addItem(userId, item);
        response.json(cart);
    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://localhost:3001/api/carts/remove-item/:productId
router.put("/carts/remove-item/:productId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = response.locals.user._id;
        const productId = request.params.productId;
        await cartsLogic.removeItem(userId, productId);
        response.sendStatus(200);
    }
    catch (err: any) {
        next(err);
    }
});

// DELETE http://localhost:3001/api/carts
router.delete("/carts", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = response.locals.user._id;
        await cartsLogic.deleteCart(userId);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;