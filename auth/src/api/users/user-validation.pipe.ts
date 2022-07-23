import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { z, ZodError } from "zod";

const UserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(4).max(20),
  })
  .strict();

type TUserOptional = z.infer<typeof UserSchema>;
export type TSignUp = Required<TUserOptional>;

@Injectable()
export class UserValidationPipe implements PipeTransform<any, TSignUp> {
  transform(value: any, metadata: ArgumentMetadata) {
    const user = UserSchema.safeParse(value);
    if (user.success == false) {
      const error = user.error;
      const msg = error.issues.map((i) => i.message);
      throw new BadRequestException(msg.join(" and "));
    }
    const newUser: TSignUp = {
      email: user.data.email,
      password: user.data.password,
    };
    return newUser;
  }
}
