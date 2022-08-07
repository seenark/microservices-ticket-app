import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type TUserData = {
  email: string;
  id: string;
};

export const UserData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return <TUserData>request.user;
  }
);
