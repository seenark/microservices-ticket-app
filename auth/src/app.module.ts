import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersController } from "./api/users/users.controller";
import { UsersService } from "./api/users/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserDocument, UserSchema } from "./schemas/user.schema";
import { PasswordService } from "./password/password.service";
import { PasswordModule } from "./password/password.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TEnv, validateEnv } from "./env.validate";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "./.env",
      isGlobal: true,
      validate: validateEnv,
    }),
    // MongooseModule.forRoot("mongodb://auth-mongo/auth"),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        return {
          uri: configService.get("MONGO_URI"),
        };
      },
    }),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        imports: [PasswordModule],
        inject: [PasswordService],
        // schema: UserSchema,
        useFactory: (passwordService: PasswordService) => {
          const schema = UserSchema;
          schema.pre<UserDocument>("save", async function (next) {
            if (this.isModified("password")) {
              const hashed = await passwordService.hashPassword(
                this.get("password"),
              );
              this.set("password", hashed);
            }
            next();
          });
          return schema;
        },
      },
    ]),
    PasswordModule,
    PassportModule,
    // JwtModule.register({
    //   secret: "test",
    //   signOptions: { expiresIn: "60s" },
    // }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        console.log("secret", configService.get("JWT_SECRET"));
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: "15m",
          },
        };
      },
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
