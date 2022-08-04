import { User } from "src/schemas/user.schema";

export const userStub = (): User => {
  return {
    email: "a@a.com",
    password: "1234",
  };
};
