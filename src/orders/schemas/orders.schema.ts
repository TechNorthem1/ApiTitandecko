import { Schema } from "mongoose";

export const ordersSchema = new Schema({
    payment_method: {type: String, required:true},
    payment_method_title: {type: String, required:true},
    set_paid:{type: Boolean, required: true},
    status: {type: String, required:true},
    billing: {type: Object, required:true},
    shipping: {type: Object, required: true},
    line_items: {type: Array, required:true},
    shipping_lines: {type: Object, required:false},
    order_id_woocommerce: {type: Number, required:true},
    user: Schema.Types.ObjectId
}, {timestamps: true});