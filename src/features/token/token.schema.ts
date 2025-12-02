import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { Schema, Document, Types } from "mongoose";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Token {
  @prop({ required: true })
  token!: string;

  @prop({
    enum: ["verify-email", "reset-password"],
    required: true,
  })
  type!: string;

  @prop({ refPath: "userModel", required: true })
  public user!: Types.ObjectId;

  @prop({ required: true, default: "User", enum: ["User"] })
  userModel!: string;

  @prop({ type: Schema.Types.Mixed })
  payload?: any;

  @prop({ required: true })
  expireAt!: Date;
}

export const TokenModel = getModelForClass(Token, {
  schemaOptions: { timestamps: true },
});
export interface IToken extends Document, Token {}
