export interface IOrder {
    id?: string;
    items?: IItems[];
    status?: string;
    discountCode?: string;
    shippingAddress: string;
    total?: number;
}

export interface IItems {
    productId: string;
    quantity: number;
    price: number;
}
