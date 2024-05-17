import { UserDto } from "../dtos/userDto.js";

class SessionRepository {
    constructor(userManager) {
        this.manager = userManager;
    }

    getUserById = async(userId) => await this.manager.getUserById(userId);
    getUserByEmail = async(email) => await this.manager.getUserByEmail(email);
    register = async(newUser) => {
        // const newUserDto = new UserDto(newUser);
        return await this.manager.addUser(newUser);
    }
    logout = async() => {}
    changePasswordFor = async(user, newPassword) => await this.manager.changePasswordFor(user, newPassword);
    updateLastConnection = async(userId) => await this.manager.updateLastConnection(userId);
}

export { SessionRepository }