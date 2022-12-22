const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const { expect } = chai;
const server = require("../index");
const fs = require("fs");
require("dotenv").config();

console.log();

const API = process.env.BASE_URL;
chai.use(chaiHttp);

// You must be signed as a seller for this route to work. Replace the SAMPLE_TOKEN with the bearer token which is generated when a seller signs in
describe("POST route", () => {
  it("Create product", async () => {
    const response = await chai
      .request(API)
      .post("/api/v1/product/create")
      .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
      .set("content-type", "multipart/form-data")
      .field("name", "Kuch bhi lelo")
      .field("price", "250")
      .attach("content", fs.readFileSync(`${__dirname}/testContent/1.png`));
    expect(response.body).to.be.an("object");
  });
});

// You must be signed as a either a buyer or a seller for this route to work. Replace the SAMPLE_TOKEN with the bearer token which is generated when a valid user signs in
describe("GET", () => {
  it("get all user products", (done) => {
    chai
      .request(API)
      .get("/api/v1/product/get/all")
      .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("Products");
        res.body.Products.should.be.a("array");
        done();
      });
  });
});
