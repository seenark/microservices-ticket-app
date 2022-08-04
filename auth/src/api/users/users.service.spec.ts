import { Test, TestingModule } from "@nestjs/testing";
import { PasswordService } from "../../password/password.service";
import { UsersService } from "./users.service";
import { User } from "../../schemas/user.schema";
import { getModelToken } from "@nestjs/mongoose";

const email = "a@a.com";
const password = "1234";
const id = "123";

class MockUserModel {
  constructor(private data: User) {}
  save = jest.fn().mockReturnValue({ email, _id: id, password });
  static findOne = jest.fn().mockReturnValue({ email, _id: id });
}

class MockPasswordService {
  static compare = jest.fn().mockReturnValue(true);
}

describe("TtService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PasswordService,
          useValue: MockPasswordService,
        },
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create user", async () => {
    expect(service.createUser(email, password)).resolves.toEqual({ email, id });
  });

  it("should sign in", async () => {
    expect(service.signin(email, password)).resolves.toEqual({ email, id });
  });
});
