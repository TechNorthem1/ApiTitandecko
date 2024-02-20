import { Schema } from "mongoose";

export const municipalitySchema = new Schema({
    municipality_id : Number,
    name: String,
    departament: Number,
})