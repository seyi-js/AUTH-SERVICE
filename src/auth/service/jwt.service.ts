import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDoc } from '../auth.schema';
import { Model } from 'mongoose';
import { JwtService as JWT } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class JWTService {
  private readonly jwt: JWT;
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDoc>,
    jwt: JWT,
  ) {
    this.jwt = jwt;
  }

  public async decodeToken(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  public async validateUser(decoded: any): Promise<AuthDoc> {
    return this.authModel.findById(decoded.id);
  }

  public generateToken(auth: AuthDoc): string {
    return this.jwt.sign({ id: auth.id, email: auth.email });
  }

  public isValidPassword(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public hashPassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public async verifyToken(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (error) {
      throw error;
    }
  }
}
