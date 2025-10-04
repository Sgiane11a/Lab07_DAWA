import userService from '../services/UserService.js';
import userRepository from '../repositories/UserRepository.js';

class UserController {

    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await userService.getById(req.userId);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }
    async updateMe(req, res, next) {
        try {
            const { roles, password, ...userData } = req.body;
            const updatedUser = await userRepository.updateById(req.userId, userData);
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

}

export default new UserController();