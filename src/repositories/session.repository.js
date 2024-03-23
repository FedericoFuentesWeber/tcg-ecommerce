import { UserDto } from "../dtos/userDto.js";

class SessionRepository {
    constructor(userManager) {
        this.manager = userManager;
    }

    login = async(email) => await this.manager.getUserByEmail(email);
    register = async(newUser) => {
        const newUserDto = new UserDto(newUser);
        return await this.manager.addUser(newUserDto);
    }
    logout = async() => {} 
}

export { SessionRepository }