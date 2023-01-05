import { UserAttrs, User } from '../models/user';

export class UserService {
  static async getUserByEmail(email: string) {
    const existingUser = await User.findOne({ email });
    return existingUser;
  }

  static async createUser(params: UserAttrs) {
    const user = User.build(params);
    await user.save();
    return user;
  }
}