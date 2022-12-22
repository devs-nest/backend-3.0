const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const server = require("../index");
require("dotenv").config();

const API = process.env.BASE_URL;
chai.use(chaiHttp);

describe("/POST testing user signup", () => {
  it("creates a new user", (done) => {
    chai
      .request(API)
      .post("/api/v1/user/signup")
      .send({
        name: "James Nannes",
        email: "jn57@hehemail.com",
        password: "Hello@6969",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.contain("Welcome to Devsnest");
        done();
      });
  });
});

describe("/POST /POST testing user signin", () => {
  it("logs in a user", (done) => {
    chai
      .request(API)
      .post("/api/v1/user/signin")
      .send({
        email: "jd57@hehemail.com",
        password: "Hello@6969",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.equal("Signed In Successfully!");
        res.body.should.have.property("bearerToken");
        done();
      });
  });
});

describe("GET /POST testing user sign out", () => {
  it("sign out the user", (done) => {
    chai
      .request(API)
      .get("/api/v1/user/signout")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.message.should.contain("Signed out successfully");
        done();
      });
  });
});

// You must be signed as a buyer for this route to work. Replace the sample token with the bearer token which is generated when a buyer signs in 
describe("GET testing fetching user orders", () => {
  it("get all user orders", (done) => {
    chai
      .request(API)
      .get("/api/v1/user/orders")
      .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("orders");
        res.body.orders.should.be.a("array");
        done();
      });
  });
});
