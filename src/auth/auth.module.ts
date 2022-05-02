import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthSchema, Auth } from './auth.schema';
import { AuthService } from './service/auth.service';
import { JWTService } from './service/jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
const config = require('../config/index');
@Module({
  imports: [
    JwtModule.register({
      secret: config.JWT_CONFIG.secret,
      signOptions: { expiresIn: '365d' },
    }),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  providers: [AuthService, JWTService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
