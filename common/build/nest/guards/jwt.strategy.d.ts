import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private logger;
    constructor(configService: ConfigService<{
        JWT_SECRET: string;
    }>);
    validate(payload: {
        email: string;
        id: string;
        iat: number;
        exp: number;
    }): Promise<{
        email: string;
        id: string;
    }>;
}
export {};
