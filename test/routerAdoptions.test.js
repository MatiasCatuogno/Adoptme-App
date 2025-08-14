import { expect } from "chai";
import supertest from "supertest";
import { describe, it, before, after } from "mocha";
import mongoose, { isValidObjectId } from "mongoose";

const requester = supertest("http://localhost:8080");

let testUserId;
let testPetId;
let testAdoptionId;

before(async () => {
 await mongoose.connect(process.env.MONGO_URL);

 const userRes = await requester.post("/api/sessions/register").send({
  first_name: "AdoptTest",
  last_name: "User",
  email: "adopttestuser@example.com",
  password: "testpassword",
 });

 testUserId = (await mongoose.connection.collection("users").findOne({ email: "adopttestuser@example.com" }))._id.toString();

 const petRes = await requester.post("/api/pets").send({
  name: "AdoptTestPet",
  specie: "dog",
  birthDate: "2020-01-01",
 });
 testPetId = petRes.body.payload._id;
});

after(async () => {
 if (testAdoptionId) {
  await mongoose.connection.collection("adoptions").deleteOne({ _id: new mongoose.Types.ObjectId(testAdoptionId) });
 }
 if (testUserId) {
  await mongoose.connection.collection("users").deleteOne({ _id: new mongoose.Types.ObjectId(testUserId) });
 }
 if (testPetId) {
  await mongoose.connection.collection("pets").deleteOne({ _id: new mongoose.Types.ObjectId(testPetId) });
  await mongoose.disconnect();
 }
});

describe("Pruebas router Adoptions", function () {
 this.timeout(10_000);

 it("GET /api/adoptions debe devolver un array de adopciones (puede estar vacío)", async () => {
  const { status, body } = await requester.get("/api/adoptions");
  expect(status).to.be.eq(200);
  expect(body).to.have.property("status", "success");
  expect(body).to.have.property("payload");
  expect(Array.isArray(body.payload)).to.be.true;
 });

 it("POST /api/adoptions/:uid/:pid debe crear una adopción válida", async () => {
  const { status, body } = await requester.post(`/api/adoptions/${testUserId}/${testPetId}`);

  expect(status).to.be.eq(200);
  expect(body).to.have.property("status", "success");
  expect(body).to.have.property("message", "Pet adopted");

  const adoption = await mongoose.connection.collection("adoptions").findOne({
   owner: new mongoose.Types.ObjectId(testUserId),
   pet: new mongoose.Types.ObjectId(testPetId),
  });
  expect(adoption).to.exist;
  testAdoptionId = adoption._id.toString();
 });

 it("GET /api/adoptions/:aid debe devolver la adopción creada", async () => {
  const { status, body } = await requester.get(`/api/adoptions/${testAdoptionId}`);

  expect(status).to.be.eq(200);
  expect(body).to.have.property("status", "success");
  expect(body).to.have.property("payload");
  expect(body.payload).to.have.property("_id");
  expect(isValidObjectId(body.payload._id)).to.be.true;
 });

 it("GET /api/adoptions/:aid con ID inválido debe devolver error", async () => {
  const { status, body } = await requester.get("/api/adoptions/XXX");

  expect(status).to.not.eq(200);
  expect(body).to.have.property("error");
 });

 it("POST /api/adoptions/:uid/:pid con UID inválido debe devolver error", async () => {
  const { status, body } = await requester.post(`/api/adoptions/XXX/${testPetId}`);

  expect(status).to.not.eq(200);
  expect(body).to.have.property("error");
 });

 it("POST /api/adoptions/:uid/:pid con PID inválido debe devolver error", async () => {
  const { status, body } = await requester.post(`/api/adoptions/${testUserId}/XXX`);

  expect(status).to.not.eq(200);
  expect(body).to.have.property("error");
 });

 it("POST /api/adoptions/:uid/:pid con mascota ya adoptada debe devolver error", async () => {
  const { status, body } = await requester.post(`/api/adoptions/${testUserId}/${testPetId}`);

  expect(status).to.not.eq(200);
  expect(body).to.have.property("error");
 });
});