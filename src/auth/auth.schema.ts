import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
export type AuthDoc = Auth & Document;

@Schema()
export class Auth {
  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    length: 8,
  })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
