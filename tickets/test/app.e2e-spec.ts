import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { JwtAuthGuard } from "@hdgticket/common";
import { TicketsService } from "src/api/tickets/tickets.service";
import { getModelToken } from "@nestjs/mongoose";
import { Ticket } from "src/schemas/ticket.schema";

class MockTickeModel {
  constructor(private data: Ticket) {}
  save = jest.fn().mockReturnValue({});
  static findAll = jest.fn().mockReturnValue([]);
  static create = jest.fn().mockReturnValue({});
}

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let ticketService: TicketsService;
  const JWT = "jwt=abc-1234";
  const ticket = [];
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        TicketsService,
        {
          provide: getModelToken(Ticket.name),
          useValue: MockTickeModel,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate(ctx: ExecutionContext) {
          // return true;
          const http = ctx.switchToHttp();
          const req = http.getRequest();
          if (req.headers.cookie == JWT) {
            req.user = { email: "a@a.com", id: "1234" };
            return true;
          } else {
            return false;
          }
        },
      })
      .overrideProvider(TicketsService)
      .useValue({
        findAll: jest.fn().mockReturnValue(ticket),
        create: jest.fn().mockResolvedValue({}),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    ticketService = moduleFixture.get<TicketsService>(TicketsService);
    await app.init();
  });

  it("/health (GET)", () => {
    return request(app.getHttpServer()).get("/health").expect(200).expect("OK");
  });

  it("/api/tickets (POST)", async () => {
    const res = await request(app.getHttpServer()).post("/api/tickets");
    expect(res.status).not.toEqual(HttpStatus.NOT_FOUND);
  });

  it("can only be access if the user is signed in /api/tickets (POST)", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/tickets")
      .set("Cookie", [JWT])
      .send({});
    expect(res.status).not.toEqual(HttpStatus.UNAUTHORIZED);
  });

  it("returns error if an invalid title is provided", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/tickets")
      .set("Cookie", [JWT])
      .send({
        title: "",
        price: 10,
      });
    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it("returns an error if an invalid price is provided", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/tickets")
      .set("Cookie", [JWT])
      .send({
        title: "test title",
        price: -10,
      });
    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    const res2 = await request(app.getHttpServer())
      .post("/api/tickets")
      .set("Cookie", [JWT])
      .send({
        title: "test title",
      });
    expect(res2.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it("create a ticket with valid inputs", async () => {
    // add in a check to make sure a ticket was saved
    const res = await request(app.getHttpServer())
      .post("/api/tickets")
      .set("Cookie", [JWT])
      .send({
        title: "abcdef",
        price: 20,
      });
    expect(res.statusCode).toEqual(HttpStatus.CREATED);
  });

  it("create a ticket with valid inputs", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/tickets")
      .set("Cookie", [JWT])
      .send({
        title: "abcdef",
        price: 20,
      });
    expect(console.log("res", res));
    const all = ticketService.findAll();
    expect(all).toEqual([]);
  });
});
