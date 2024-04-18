class UserDto {
    constructor({first_name, last_name, email, age, role, id}) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.age = age;
        this.role = role;
        this.id = id;
    }
}

export { UserDto }