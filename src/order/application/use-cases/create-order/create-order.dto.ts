export interface ICreateOrder {
    items: IItems[];
    discountCode?: string;
    shippingAddress: string;
}

interface IItems {
    productId: string;
    quantity: number;
    price: number;
}
