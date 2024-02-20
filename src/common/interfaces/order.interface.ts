import { Schema } from "mongoose";
import { IBilling } from "./billing.interface";
import { ILineItems } from "./lineItems.interface";
import { IShipping } from "./shipping.interface";

export interface IOrder {
    payment_method: string;
    payment_method_title: string;
    status:string;
    set_paid:boolean;
    billing: IBilling;
    shipping: IShipping;
    line_items:ILineItems[];
    shipping_lines:Object;
    order_id_woocommerce:number;
    user: Schema.Types.ObjectId;
}