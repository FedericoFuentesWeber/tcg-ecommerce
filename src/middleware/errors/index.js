import { EErrors } from "../../utils/errors/enums.js";

const {
    INVALID_TYPES_ERROR
} = EErrors;

const errorHandler = (error, req, res, next) => {
    console.log(error.cause);
    switch(error.code) {
        case INVALID_TYPES_ERROR:
            res.send({ status:"error", error:error.name });
            break;
        default:
            res.send({ status:"error", error:"Unhandled error" });
    }
};

export { errorHandler };