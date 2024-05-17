export class User {
    constructor({
        id, 
        first_name, 
        last_name, 
        email, 
        password, 
        age, 
        cartId,
        documents,
        lastConnection
    }) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.age = age;
        this.cartId = cartId;
        this.documents = documents;
        this.lastConnection = lastConnection;
    }
}