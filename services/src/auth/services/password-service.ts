import bcrypt from 'bcrypt';

export class PasswordService {
  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  static compare = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
  }
}