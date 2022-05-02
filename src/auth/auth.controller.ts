import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ValidateRequestDto,
} from './auth.dto';
import {
  AUTH_SERVICE_NAME,
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from './auth.pb';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
  private async register(
    payload: RegisterRequestDto,
  ): Promise<RegisterResponse> {
    return await this.service.register(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  private async login(payload: LoginRequestDto): Promise<LoginResponse> {
    return await this.service.login(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  private async validate(
    payload: ValidateRequestDto,
  ): Promise<ValidateResponse> {
    return await this.service.validate(payload);
  }
}
