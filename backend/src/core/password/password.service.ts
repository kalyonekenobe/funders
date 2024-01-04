import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    private readonly saltPrefix: string,
    private readonly saltSuffix: string,
    private readonly saltRounds: number,
  ) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(`${this.saltPrefix}.${password}.${this.saltSuffix}`, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(`${this.saltPrefix}.${password}.${this.saltSuffix}`, hash);
  }
}
