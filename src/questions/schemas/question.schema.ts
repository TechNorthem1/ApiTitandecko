import { Schema } from "mongoose";

export const questionSchema = new Schema ({
  name: {type: String, required: true},
  lastname: {type: String, required: true},
  phone: {type: String, required: true},
  email: {type: String, required: true},
  question: {type: String, required: true},
  response: {type: String, required: false}
}, {timestamps: true})
