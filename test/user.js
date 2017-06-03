process.env.NODE_ENV = "test";

//const mongoose = require("mongoose");
const User = require("../models/user");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

describe("Users", () => {
  before((done) => {
    // empty the database
    const remove = User.remove({});
    const user = new User({
      "email": "charlantfr@gmail.com",
      "password": "Soshag29",
      "username": "charlesfranciscodev",
      "firstName": "Charles",
      "lastName": "Francisco",
      "avatarUrl": "http://placeimg.com/400/400/any"
    });
    remove.exec().then(() => {
      // create a test user
      return user.save();
    })
    .then(() => {
      done();
    });
  });

  // POST /login test
  describe("POST /login", () => {
    it("should log the user", (done) => {
      // login the user
      chai.request(app)
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Login successful.");
          res.body.should.have.property("user");
          const user = res.body.user;
          user.should.have.property("id");
          user.should.have.property("email");
          user.should.have.property("username");
          done();
        });
    });
  });

  // POST /register test
  describe("POST /register", () => {
    it("should create a new user", (done) => {
      // register the user
      chai.request(app)
        .post("/register")
        .send({
          "email": "charlesfranciscodev@gmail.com",
          "password": "Menpaw81",
          "username": "fire",
          "firstName": "Charlie",
          "lastName": "Brown",
          "avatarUrl": "http://placeimg.com/500/500/any"
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("User successfully created.");
          res.body.should.have.property("user");
          const user = res.body.user;
          user.should.have.property("id");
          user.should.have.property("email");
          user.should.have.property("username");
          user.should.have.property("firstName");
          user.should.have.property("lastName");
          user.should.have.property("avatarUrl");
          user.should.have.property("createdAt");
          done();
        });
    });
  });

  // GET /profile
  describe("GET /profile", () => {
    it("should get the user's profile info", (done) => {
      // login the user
      const agent = chai.request.agent(app);
      agent
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .then((res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");

          // get the user's profile info
          return agent.get("/profile")
          .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
            const user = res.body.user;
            user.should.have.property("email");
            user.should.have.property("username");
            user.should.have.property("firstName");
            user.should.have.property("lastName");
            user.should.have.property("avatarUrl");
            done();
          });
        })
        .catch(function (err) {
          throw err;
        });
    });
  });

  // PUT /profile
  describe("PUT /profile", () => {
    it("should update the user's profile info", (done) => {
      // login the user
      const agent = chai.request.agent(app);
      agent
        .post("/login")
        .send({
          "email": "charlantfr@gmail.com",
          "password": "Soshag29",
        })
        .then((res) => {
          res.should.have.status(200);
          expect(res).to.have.cookie("connect.sid");

          const user = {
            "email": "charlantfr2@gmail.com",
            "username": "charlesfranciscodev2",
            "firstName": "Charles2",
            "lastName": "Francisco2",
            "avatarUrl": "http://placeimg.com/450/450/any"
          }

          // update the user's profile info
          return agent.put("/profile")
          .send({
            "email": user.email,
            "password": "Tevdud26",
            "username": user.username,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "avatarUrl": user.avatarUrl
          })
          .then((res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
            const userRes = res.body.user;
            expect(userRes).to.eql(user);
            done();
          });
        })
        .catch(function (err) {
          throw err;
        });
    });
  });
});
