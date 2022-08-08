import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideGuard(JwtAuthGuard)
      // .useValue({
      //   canActivate(ctx: ExecutionContext) {
      //     return true;
      //   },
      // })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/health (GET)", () => {
    return request(app.getHttpServer()).get("/health").expect(200).expect("OK");
  });

  it("/api/tickets (GET)", async () => {
    const res = await request(app.getHttpServer()).get("/api/tickets");
    expect(res.status).not.toEqual(HttpStatus.NOT_FOUND);
  });

  it("can only be access if the user is signed in", async () => {
    const res = await request(app.getHttpServer()).get("/api/tickets").send({});
    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it("returns error if an invalid title is provided", async () => {
    expect(true).toEqual(false);
  });

  it("returns an error if an invalid price is provided", async () => {
    expect(true).toEqual(false);
  });
});
