import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js";
import { MessageManagerDB } from "../daos/DBManagers/MessageManager/MessageManagerDB.js";
import { ProductManagerDB } from "../daos/DBManagers/ProductManager/ProductManagerDB.js";
import { UserManagerDB } from "../daos/DBManagers/UserManager/UserManagerDB.js";
import { CartRepository } from "./carts.repository.js";
import { MessageRepository } from "./message.repository.js";
import { ProductRepository } from "./product.repository.js";
import { SessionRepository } from "./session.repository.js";
import { UserRepository } from "./user.repository.js";

const cartService = new CartRepository(new CartManagerDB());
const productService = new ProductRepository(new ProductManagerDB());
const sessionService = new SessionRepository(new UserManagerDB());
const messageService = new MessageRepository(new MessageManagerDB());
const userService = new UserRepository(new UserManagerDB());

export { cartService, productService, sessionService, messageService, userService }