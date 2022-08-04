import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

const inputUser = {
  email: "a@a.com",
  password: "1234",
};
const createdUser = {
  email: "a@a.com",
  id: "123",
};
const mockJwtService = {
  sign: jest.fn().mockReturnValue("123"),
};
const mockExpressResponse: any = {
  cookie: jest.fn().mockImplementation((name: string, obj: any) => null),
};
const mockUserService = {
  createUser: jest
    .fn()
    .mockImplementation((email: string, password: string) => {
      return createdUser;
    }),
};

// jest.mock("users.service");

describe(UsersController.name, () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService, JwtService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should signup", async () => {
    expect(controller.signup(inputUser, mockExpressResponse)).resolves.toEqual({
      id: expect.any(String),
      email: createdUser.email,
    });
    expect(service.createUser).toHaveBeenCalledWith(
      inputUser.email,
      inputUser.password,
    );
  });
});
