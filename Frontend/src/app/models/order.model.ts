export class OrderModel {
    public _id: string;
    public userId: string;
    public cartId: string;
    public totalPrice: number;
    public city: string;
    public street: string;
    public shippingDate: string;
    public creationDate: string;
    public lastFourDigits: string;
}