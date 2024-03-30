const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a String, received ${user.first_name}
    * last_name : needs to be a String, received ${user.last_name}
    * age : needs to be a String, received ${user.age}
    * email : needs to be a String, received ${user.email}`
};

const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title : needs to be String, received ${product.title}
    * description : needs to be String, received ${product.description}
    * code : needs to be String, received ${product.code}
    * category : needs to be String, received ${product.category}
    * price : needs to be Number, received ${product.price}
    * stock : needs to be Number, received ${product.stock}`
};

const objectAlreadyIncludedErrorInfo = (code) => {
    return `An object with code ${code} already exists.`
}

export {
    generateUserErrorInfo,
    generateProductErrorInfo,
    objectAlreadyIncludedErrorInfo
};