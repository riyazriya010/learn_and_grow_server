import { UserRepository } from "../repositories/userRepository";
import { IUser } from "../models/user.model";
import bcrypt from "bcrypt";

export class UserServices {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(userData: { username: string; email: string; phone: string; password: string }): Promise<IUser> {
        // Check if the email or phone already exists using repository methods
        const existingUserByEmail = await this.userRepository.findUserByEmail(userData.email);
        const existingUserByPhone = await this.userRepository.findUserByPhone(userData.phone);

        if (existingUserByEmail) {
            throw new Error('User with this email already exists');
        }
        if (existingUserByPhone) {
            throw new Error('User with this phone number already exists');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create the user object with hashed password
        const newUser = {
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            password: hashedPassword,
        };

        // Save the user via the repository
        const createdUser = await this.userRepository.createUser(newUser);

        return createdUser;
    }
}
