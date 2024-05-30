import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "users";

const userSchema = new Schema ({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN", "PREMIUM"],
        default: "USER"
    },
    age: {
        type: Number
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: []
    },
    lastConnection: {
        type: Date,
        default: null
    }
});

userSchema.plugin(mongoosePaginate);

export default model(collection, userSchema);