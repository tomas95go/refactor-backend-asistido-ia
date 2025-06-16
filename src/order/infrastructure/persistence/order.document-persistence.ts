import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentOrder extends Document {
    _id: string;
    items: IItems[];
    status: string;
    discountCode?: string;
    shippingAddress: string;
    total?: number;
}

interface IItems {
    productId: string;
    quantity: number;
    price: number;
}

const OrderSchema: Schema = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    items: [
        {
            productId: { type: String },
            quantity: { type: Number },
            price: { type: Number },
        },
    ],
    status: { type: String, default: 'CREATED' },
    discountCode: { type: String, required: false },
    shippingAddress: { type: String },
    total: { type: Number, default: 0 },
});

export const OrderDocumentPersistenceEntity = mongoose.model<IDocumentOrder>('Order', OrderSchema);
