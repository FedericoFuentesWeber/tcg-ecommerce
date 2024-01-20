import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: Array,
        requiered: true
    }
});

export default model("carts", cartSchema);