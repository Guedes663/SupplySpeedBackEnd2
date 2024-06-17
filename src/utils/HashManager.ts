import bcrypt from 'bcryptjs';

export class HashManager {
  private saltRounds: number;

  constructor() {
    this.saltRounds = parseInt(process.env.SALT_ROUNDS || '12', 12);
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async comparePassword(password: string, hash: string) {
    const match = await bcrypt.compare(password, hash);
    return match;
  }
}
