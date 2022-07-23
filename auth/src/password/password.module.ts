import { Module } from "@nestjs/common";
import { PasswordService } from "./password.service";

@Module({
  imports: [],
  exports: [PasswordService],
  providers: [PasswordService],
})
export class PasswordModule {}
