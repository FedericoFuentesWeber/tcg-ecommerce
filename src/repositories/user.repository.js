class UserRepository {
    constructor(userManager) {
        this.manager = userManager;
    }

    getUsers = async() => await this.manager.getUsers();
    getUserById = async(userId) => await this.manager.getUserById(userId);
    changeRoleFor = async(user, newRole) => await this.manager.changeRoleFor(user, newRole);
}

export { UserRepository }