const chai = require("chai");
const app = require("../../app");
describe("contractsController", () => {
  describe("getProfileContract", () => {
    it("should get a 401 error if not authenticated", (done) => {
      chai
        .request(app)
        .get("/contracts/1")
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          done();
        });
    });

    it("should get first contract if header profile_id is present", (done) => {
      chai
        .request(app)
        .get("/contracts/1")
        .set("profile_id", 1)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });

  it("should throw fail if id is not found", (done) => {
    chai
      .request(app)
      .get("/contracts/33333")
      .set("profile_id", 1)
      .end((err, res) => {
        chai.expect(res).to.not.have.status(200);
        done();
      });
  });

  it("should throw fail if id is not found", (done) => {
    chai
      .request(app)
      .get("/contracts/33333")
      .set("profile_id", 1)
      .end((err, res) => {
        chai.expect(res).to.have.status(404);
        done();
      });
  });

  it("should fail trying to access contracts from other client", (done) => {
    chai
      .request(app)
      .get("/contracts/6")
      .set("profile_id", 1)
      .end((err, res) => {
        chai.expect(res).to.have.status(404);
        done();
      });
  });
});
