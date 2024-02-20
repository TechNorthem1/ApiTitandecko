import { Schema } from "mongoose";

export const userSchema = new Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    phone: {type: String, required: true},
    citizenshipCard: {type: String, required: false},
    address: {type: String, required: false},
    address1: {type: String, required: false},
    address2: {type: String, required: false},
    address3: {type: String, required: false},
    avenue: {type: String, required: false},
    complement_information: {type: String, required: false},
    departament: {type: String, required: false},
    municipaly: {type: String, required: false},
    document: {type: String, required: false},
    email_send: {type: String, required: false},
    information_aditional: {type: String, required: false},
    method: {type: String, required: false},
    neighborhood: {type: String, required: false},
    auth: {type: Schema.Types.ObjectId, ref: "auth"}
}, {timestamps: true});
