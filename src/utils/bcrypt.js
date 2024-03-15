import bcrypt from 'bcrypt';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordToValidate, userPassword) => {
    return bcrypt.compareSync(passwordToValidate, userPassword);
};