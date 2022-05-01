import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
const config = require('./config/index');
@Module({
  imports: [AuthModule, MongooseModule.forRoot(config.DB_CONFIG.url)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
