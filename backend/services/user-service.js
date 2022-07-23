const hashService = require('../services/hash-service');
const UserModel = require('../models/user');

class UserService {
    async findUser(filter) {
        const user = await UserModel.findOne(filter);
        return user;
    }

    async createUser(data) {
        const { password } = data;
        const hashedPassword = await hashService.hashPassword(password);
        const user = await UserModel.create({ ...data, password: hashedPassword });
        return user;
    }
}

module.exports = new UserService();