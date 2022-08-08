import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { TEnv } from "./env.validate";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  private logger = new Logger(JwtStrategy.name);
  constructor(private readonly configService: ConfigService<TEnv>) {
    const jwtExtractor: JwtFromRequestFunction = (
      req: Request,
    ): string | null => {
      try {
        const jwt = req.cookies["jwt"];
        this.logger.log("jwt", jwt);
        return jwt;
      } catch (error) {
        return null;
      }
    };
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: {
    email: string;
    id: string;
    iat: number;
    exp: number;
  }) {
    return {
      email: payload.email,
      id: payload.id,
    };
  }
}
