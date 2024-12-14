import { User, IUser } from "../models/user.model";

export class UserRepository {
    // Method to create a new user
    async createUser(userData: { username: string; email: string; phone: string; password: string }): Promise<IUser> {
        // Check if a user with the same email already exists
        const existingUserByEmail = await User.findOne({ email: userData.email });
        if (existingUserByEmail) {
            throw new Error('User with this email already exists');
        }

        // Check if a user with the same phone already exists
        const existingUserByPhone = await User.findOne({ phone: userData.phone });
        if (existingUserByPhone) {
            throw new Error('User with this phone number already exists');
        }

        // Create a new user document in the database
        const newUser = new User(userData);

        // Save the user to the database and return it
        return newUser.save();
    }

    // Method to find a user by email
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    // Method to find a user by phone number
    async findUserByPhone(phone: string): Promise<IUser | null> {
        return await User.findOne({ phone });
    }
}
