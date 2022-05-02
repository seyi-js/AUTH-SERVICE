import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDoc } from '../auth.schema';
import { Model } from 'mongoose';
import { JWTService } from './jwt.service';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ValidateRequestDto,
} from '../auth.dto';
@Injectable()
export class AuthService {
  @InjectModel(Auth.name)
  private AuthModel: Model<AuthDoc>;

  @Inject(JWTService)
  private readonly jwtService: JWTService;

  public async register({
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    try {
      let auth: AuthDoc = await this.AuthModel.findOne({ email });
      if (auth)
        return { status: HttpStatus.CONFLICT, error: ['email exists.'] };

      password = this.jwtService.hashPassword(password);
      await this.AuthModel.create({ email, password });

      return { status: HttpStatus.CREATED, error: null };
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: [error] };
    }
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    try {
      const auth: AuthDoc = await this.AuthModel.findOne({ email });

      if (!auth)
        return {
          status: HttpStatus.NOT_FOUND,
          error: ['invalid credentials supplied.'],
          token: null,
        };

      const isValidPassword: boolean = this.jwtService.isValidPassword(
        password,
        auth.password,
      );

      if (!isValidPassword)
        return {
          status: HttpStatus.NOT_FOUND,
          error: ['invalid credentials supplied.'],
          token: null,
        };

      const token: string = this.jwtService.generateToken(auth);

      return { token, status: HttpStatus.OK, error: null };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: [error],
        token: undefined,
      };
    }
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    try {
      const decoded: AuthDoc = await this.jwtService.verifyToken(token);

      if (!decoded)
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: ['Token is Valid'],
          userId: null,
        };

      const auth: AuthDoc = await this.jwtService.validateUser(decoded);

      if (!auth) throw new UnauthorizedException();

      return { status: HttpStatus.OK, error: null, userId: decoded.id };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
