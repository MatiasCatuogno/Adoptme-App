import bcrypt from "bcrypt";
import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import { describe, it, after } from "mocha";

const requester = supertest("http://localhost:8080");

try {
 await mongoose.connect(process.env.MONGO_URL);
} catch (error) {
 console.log(error);
}

describe("Pruebas router sessions", function () {
 this.timeout(10_000);

 const testUser = {
  first_name: "Test",
  last_name: "User",
  email: "testuser@example.com",
  password: "testpassword123",
 };

 after(async () => {
  await mongoose.connection.collection("users").deleteOne({ email: testUser.email });
 });

 it("Debe registrar un usuario correctamente en /api/sessions/register y guardar la contraseña hasheada", async () => {
  const { status, body } = await requester.post("/api/sessions/register").send(testUser);

  expect(status).to.be.eq(200);
  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.have.property("payload");
  expect(body.payload).to.be.a("string");

  const userDb = await mongoose.connection.collection("users").findOne({ email: testUser.email });
  expect(userDb).to.exist;
  expect(userDb.password).to.not.equal(testUser.password);
  const isMatch = await bcrypt.compare(testUser.password, userDb.password);
  expect(isMatch).to.be.true;
 });

 it("No debe registrar un usuario ya existente en /api/sessions/register", async () => {
  const { status, body } = await requester.post("/api/sessions/register").send(testUser);

  expect(status).to.not.eq(200);
  expect(body).to.have.property("error").and.to.be.eq("INTERNAL_ERROR");
  expect(body).to.have.property("message").and.to.be.eq("Error inesperado - reintente en unos minutos o conecte con el administrador");
 });

 it("No debe registrar un usuario con datos incompletos", async () => {
  const { status, body } = await requester.post("/api/sessions/register").send({
   first_name: "Test",
   email: "incompleto@example.com"
  });

  expect(status).to.not.eq(200);
  expect(body).to.have.property("error").and.to.be.eq("INTERNAL_ERROR");
  expect(body).to.have.property("message").and.to.be.eq("Error inesperado - reintente en unos minutos o conecte con el administrador");
 });

 it("Debe loguear un usuario correctamente en /api/sessions/login y devolver cookie", async () => {
  const { status, body, headers } = await requester.post("/api/sessions/login").send({
   email: testUser.email,
   password: testUser.password,
  });

  expect(status).to.equal(200);
  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("message").and.to.be.eq("Logged in");
  expect(headers).to.have.property("set-cookie");
 });

 it("No debe loguear con credenciales incorrectas en /api/sessions/login", async () => {
  const { status, body } = await requester.post("/api/sessions/login").send({
   email: testUser.email,
   password: "wrongpassword",
  });

  expect(status).to.not.equal(200);
  expect(body).to.have.property("error");
 });

 it("No debe loguear un usuario inexistente", async () => {
  const { status, body } = await requester.post("/api/sessions/login").send({
   email: "noexiste@example.com",
   password: "cualquiercosa",
  });

  expect(status).to.not.equal(200);
  expect(body).to.have.property("error").and.to.be.eq("INTERNAL_ERROR");
  expect(body).to.have.property("message").and.to.be.eq("Error inesperado - reintente en unos minutos o conecte con el administrador");
 });
});