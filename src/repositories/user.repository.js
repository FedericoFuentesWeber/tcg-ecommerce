class UserRepository {
    constructor(userManager) {
        this.manager = userManager;
    }

    getUsers = async() => await this.manager.getUsers();
    getUserById = async(uid) => await this.manager.getUserById(uid);
}

export { UserRepository }