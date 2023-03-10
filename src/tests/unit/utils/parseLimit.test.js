const chai = require("chai");

const parseLimit = require("../../../utils/parseLimit");

describe("parseLimit", () => {
  it("should return a limit and offset params", (done) => {
    const response = parseLimit({
      query: {},
      params: { limit: 3, skip: 10 },
    });
    // Call the function with the input and verify the output
    chai.expect(response).to.not.be.empty;
    done();
  });

  it("should return a default of 25 limit", (done) => {
    const response = parseLimit({
      query: {},
      params: {},
    });
    // Call the function with the input and verify the output
    chai.expect(response).to.not.be.empty;
    chai.expect(response.limit).to.be.equal(25);
    done();
  });
});
