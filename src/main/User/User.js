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

    allDocumentsRequiredLoaded = () => {
        const documents = this.documents;
        const documentsNeeded = [
            "Identificacion",
            "Comprobante de domicilio",
            "Comprobante de estado de cuenta"
        ];

        const names = documents.map(file => {
            const { name } = file;

            //This is done because the files extensions are not specified
            const lastDotIndex = name.lastIndexOf(".");
            return lastDotIndex === -1 ? name : name.substring(0, lastDotIndex);
        });

        if(documents.length < 3) return false;

        return names.every((name) => {
            documentsNeeded.includes(name);
        });
    };
}