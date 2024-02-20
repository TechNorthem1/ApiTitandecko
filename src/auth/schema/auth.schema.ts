import { Schema } from "mongoose";

export const authSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

authSchema.index({email: 1}, {unique: true})