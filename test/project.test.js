const request = require("supertest");
const chai = require("chai");
const app = require("../app");
const expect = chai.expect;

/* ---------------------------------------------------------------------- */

describe("API Tests", () => {
  // Stores accessToken
  let accessToken = undefined;

  // Stores recordId of newly created record
  let recordId = undefined;

  // Test for user login
  it("Log In as Nitish(user)", async function () {
    //  Logging In
    const response = await request(app).post("/api/login").send({
      username: "Nitish",
      password: "nitish123",
    });

    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal("Login Successfull");
    expect(response.body.user).to.not.be.undefined;
    expect(response.body.user.name).to.equal("Nitish");
    expect(response.body.user.role).to.equal("user");
    expect(response.body.token).to.not.be.undefined;

    // Store the access token
    accessToken = response.body.token;
  });

  // Test to Create a Record
  it("Create a record", async function () {
    const recordData = {
      name: "Nitish verma",
      salary: "190000",
      currency: "USD",
      department: "Engineering",
      sub_department: "Platform",
    };

    // Creating new Record
    const response = await request(app)
      .post("/api/records/create")
      .set("Cookie", `accessToken=${accessToken}`)
      .send(recordData);

    // Assertions
    expect(response.status).to.equal(201);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal("Record created successfully");
    expect(response.body.record).to.not.be.undefined;

    // Store new record id
    recordId = response.body.record._id;
  });

  // Test to Delete the newly created Record
  it("Delete a record", async function () {
    // Deleting the newly created record
    const response = await request(app)
      .delete(`/api/records/delete/${recordId}`)
      .set("Cookie", `accessToken=${accessToken}`);

    // Assertions
    expect(response.status).to.equal(202);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal("Record deleted successfully");
    expect(response.body.record).to.not.be.undefined;
    expect(response.body.record._id).to.equal(recordId);

    // Remove the recordId
    recordId = undefined;
  });

  // Test to get SS for all dataset if currency is specified
  it("Get SS for all dataset if currency is specified as 'USD'", async function () {
    // Getting SS
    const response = await request(app)
      .post("/api/records/ss/all")
      .set("Cookie", `accessToken=${accessToken}`)
      .send({
        currency: "USD",
      });

    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal(
      "Summary Statistics on salary for all dataset"
    );
    expect(response.body.ss).to.not.be.undefined;
    expect(response.body.ss.mean).to.not.be.undefined;
    expect(response.body.ss.min).to.not.be.undefined;
    expect(response.body.ss.max).to.not.be.undefined;
  });

  // Test to get SS for all dataset if currency is not specified
  it("Get SS for all dataset if currency is not specified", async function () {
    // Getting SS
    const response = await request(app)
      .post("/api/records/ss/all")
      .set("Cookie", `accessToken=${accessToken}`);

    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal(
      "Summary Statistics on salary for all dataset"
    );
    expect(response.body.ss).to.not.be.undefined;
    expect(response.body.ss.mean).to.not.be.undefined;
    expect(response.body.ss.min).to.not.be.undefined;
    expect(response.body.ss.max).to.not.be.undefined;
  });

  // Test to get SS for all dataset for contract one's (contract: true)
  it("Get SS for all dataset for contract one's (contract: true)", async function () {
    // Getting SS
    const response = await request(app)
      .get("/api/records/ss/onCon")
      .set("Cookie", `accessToken=${accessToken}`);

    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal(
      "Summary Statistics on salary which are on contract"
    );
    expect(response.body.ss).to.not.be.undefined;
    expect(response.body.ss.mean).to.not.be.undefined;
    expect(response.body.ss.min).to.not.be.undefined;
    expect(response.body.ss.max).to.not.be.undefined;
  });

  // Test to get SS for each unique department
  it("Get SS for each unique department", async function () {
    // Getting SS
    const response = await request(app)
      .get("/api/records/ss/dep")
      .set("Cookie", `accessToken=${accessToken}`);

    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal(
      "Summary Statistics on salary for each department"
    );
    expect(response.body.ss).to.not.be.undefined;
  });

  // Test to get SS for each department and sub department combination
  it("Get SS for each department and sub department combination", async function () {
    // Getting SS
    const response = await request(app)
      .get("/api/records/ss/dep/sub")
      .set("Cookie", `accessToken=${accessToken}`);

    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal(
      "Summary Statistics on salary for each department and sub department combination"
    );
    expect(response.body.ss).to.not.be.undefined;
  });

  // Test for user logout
  it("Log Out as Nitish(user)", async function () {
    // Logging out
    const response = await request(app)
      .post("/api/logout")
      .set("Cookie", `accessToken=${accessToken}`);

    // Assertions
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.msg).to.equal("LogOut Successfull");

    // Remove the access Token
    accessToken = undefined;
  });
});
