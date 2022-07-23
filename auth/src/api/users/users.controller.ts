import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ResponseExtend } from "src/extends.types";
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { LocalAuthGuard } from "src/local-auth.guard";
import { TUserData, UserData } from "./user-data.decorator";
import { TSignUp, UserValidationPipe } from "./user-validation.pipe";
import { UsersService } from "./users.service";

@Controller("api/users")
export class UsersController {
  private logger = new Logger(UsersController.name);
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  @Get("/")
  getUsers() {
    return "Hi there";
  }

  @Get("current-user")
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@UserData() userData: TUserData) {
    return userData;
  }

  @Post("signin")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  signin(
    @UserData() userData: TUserData,
    @Res({ passthrough: true }) res: ResponseExtend,
  ) {
    const jwt = this.jwtService.sign(userData);
    this.logger.log(jwt);
    res.cookie("jwt", jwt, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 15,
    });
    return userData;
  }

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(new UserValidationPipe()) user: TSignUp,
    @Res({ passthrough: true }) res: ResponseExtend,
  ) {
    const createdUser = await this.userService.createUser(
      user.email,
      user.password,
    );
    if (!createdUser) {
      throw new ConflictException("Email already existing");
    }
    const jwt = await this.jwtService.sign(createdUser);
    res.cookie("jwt", jwt, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 15,
    });
    return createdUser;
  }

  @Post("signout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  signout(@Res({ passthrough: true }) res: ResponseExtend) {
    res.cookie("jwt", null);
    return;
  }
}
