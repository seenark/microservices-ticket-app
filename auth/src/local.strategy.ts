import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "./api/users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger();
  constructor(private readonly userService: UsersService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  async validate(email: string, password: string) {
    const user = await this.userService.signin(email, password);
    if (!user) {
      throw new UnauthorizedException("invalid email or password");
    }
    return {
      email: user.email,
      id: user.id,
    };
  }
}
