import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PasswordService } from "../../password/password.service";
import { User, UserDocument } from "../../schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
  ) {}
  async createUser(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (user) return null;
      const newUser = new this.userModel({ email: email, password: password });
      const resUser = await newUser.save();
      return {
        email: resUser.email,
        id: resUser._id,
      };
    } catch (error) {
      return null;
    }
  }

  async signin(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }

    const isMatched = await this.passwordService.compare(
      password,
      user.password,
    );
    if (!isMatched) return null;
    return {
      email: user.email,
      id: user._id,
    };
  }
}
