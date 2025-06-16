export interface IUpdateOrder {
    id: string;
    status: string;
    discountCode?: string;
    shippingAddress: string;
}