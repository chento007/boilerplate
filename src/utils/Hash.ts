import * as bcrypt from 'bcrypt';

export class Hash {
  public static async makeHash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, 10);
  }

  public static async isMatch(
    plainText: string,
    hashed: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainText, hashed);
  }
}
