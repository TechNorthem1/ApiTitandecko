import { Schema } from "mongoose";

export const ordersSchema = new Schema({
    payment_method: {type: String, required:true},
    payment_method_title: {type: String, required:true},
    set_paid:{type: Boolean, required: true},
    status: {type: String, required:true},
    billing: {type: Object, required:true},
    shipping: {type: Object, required: true},
    line_items: {type: Array, required:true},
    coupon_lines: {type: Array, required:true},
    shipping_lines: {type: Array, required:false},
    order_id_woocommerce: {type: Number, required:true},
    total: {type:String, required:true },
    shipping_total: {type: String, required: true},
    user: Schema.Types.ObjectId
}, {timestamps: true});