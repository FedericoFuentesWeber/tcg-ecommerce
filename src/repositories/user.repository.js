class UserRepository {
    constructor(userManager) {
        this.manager = userManager;
    }

    getUsers = async() => await this.manager.getUsers();
    getUserById = async(userId) => await this.manager.getUserById(userId);
    changeRoleFor = async(userId, newRole) => await this.manager.changeRoleFor(userId, newRole);
    addDocuments = async(userId, documentsToAdd) => await this.manager.addDocuments(userId, documentsToAdd);
    deleteUser = async(userId) => await this.manager.deleteUser(userId);
    getInactiveUsers = async() => await this.manager.getInactiveUsers();
    deleteUsers = async(users) => await this.manager.deleteUsers(users);
}

export { UserRepository }