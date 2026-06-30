import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  googleId: string;

  @Prop()
  githubId: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  telegramChatId: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);