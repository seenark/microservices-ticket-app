import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MSchema } from "mongoose";

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: MSchema.Types.String,
    required: true,
    index: true,
  })
  email: string;

  @Prop({
    type: MSchema.Types.String,
    required: true,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
