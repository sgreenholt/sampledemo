const app = require("../../server");
const chai = require("chai");
const chaiHttp = require("chai-http");

// Configure Chai to use the HTTP assertion plugin
chai.use(chaiHttp);