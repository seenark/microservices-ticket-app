import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { UsersService } from "./../src/api/users/users.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  let userService: UsersService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = moduleFixture.get<UsersService>(UsersService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/api/users (GET)", () => {
    return request(app.getHttpServer())
      .get("/api/users")
      .expect(200)
      .expect("Hi there");
  });

  afterAll(async () => {
    await app.close();
  });
});
