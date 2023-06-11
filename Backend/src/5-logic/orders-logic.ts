import { CartModel, ICartModel } from "../4-models/cart-model";
import { ForbiddenError, ValidationError } from "../4-models/client-errors";
import { IOrderModel, OrderModel } from "../4-models/order-model";

// Get orders count:
async function getOrdersCount(): Promise<number> {
    return OrderModel.find().count().exec();
};

// Add order:
async function addOrder(order: IOrderModel): Promise<IOrderModel> {

    // Validate:
    const errors = order.validateSync();
    if (errors) throw new ValidationError(errors.message);

    // Check if there are already 3 orders for the desired date:
    const desiredDate = await OrderModel.find({ shippingDate: order.shippingDate }).count().exec();
    if (desiredDate === 3) throw new ForbiddenError("Please select a different shipping date. the desired date is fully booked.");

    // Insert new order into database:
    return order.save();
}

// Get Order By Id:
async function getCartByOrder(_id: string): Promise<ICartModel> {
    const order = await OrderModel.findById({ _id }).exec();
    return CartModel.findOne({ _id: order.cartId }).exec();
}

// Get user's last order:
async function getUserLastOrder(userId: string): Promise<IOrderModel> {
    return OrderModel.findOne({ userId }, {}, { sort: { $natural: -1 } }).exec();
}

export default {
    getOrdersCount,
    addOrder,
    getCartByOrder,
    getUserLastOrder
};