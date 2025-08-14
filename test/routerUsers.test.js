import { expect } from "chai";
import supertest from "supertest";
import { describe, it, after } from "mocha";

import mongoose, { isValidObjectId } from "mongoose";

const requester = supertest("http://localhost:8080");

try {
 await mongoose.connect(process.env.MONGO_URL);
} catch (error) {
 console.log(error)
}

describe("Pruebas router Usuarios", function () {
 this.timeout(10_000);

 let uid = "68606526c7a4654ce0f302af"; // Reemplazar con un UID válido de usuario en la base de datos.

 after(async () => {
  await mongoose.connection.collection("users").drop();
 })

 it("Si ejecuto la ruta /api/users, y método GET, el server responde con un objeto con la property status con el valor success y el payload con un array de usuarios.", async () => {
  let { status, body } = await requester.get("/api/users")

  expect(status).to.be.eq(200);
  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("payload");
  expect(Array.isArray(body.payload)).to.be.eq(true);

  if(Array.isArray(body.payload) && body.payload.length > 0) {
   expect(body.payload[0]._id).to.be.ok;
   expect(isValidObjectId(body.payload[0]._id)).to.be.true;
  }
 })

 it("Si ejecuto la ruta /api/users/:uid, y método GET, el server responde con un objeto con la property status con el valor success y el payload un objeto con las propiedades del usuario.", async () => {
  let { status, body } = await requester.get(`/api/users/${uid}`);

  expect(status).to.be.eq(200);
  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("payload");

  if(Array.isArray(body.payload) && body.payload.length > 0) {
   expect(body.payload[0]._id).to.be.ok;
   expect(isValidObjectId(body.payload[0]._id)).to.be.true;
  }
 })

 it("Si envío los datos de un usuario y UID válidos, a /api/users/:uid, método PUT, actualiza el usuario en DB. y el server responde un status code 200", async () => {
  let updateUser = {
   first_name: "Diego", last_name: "Polverelli", email: "test@test.com.ar", password: "12345", role: "admin", pets: [],
  }

  let { status, body } = await requester.put(`/api/users/${uid}`).send(updateUser)

  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("message").and.to.be.eq("User updated");
  expect(status).to.be.eq(200);
 })

 it("Si envío los datos de un usuario o UID inválidos, a /api/users/:uid, método PUT, el server responde con un status code 400.", async () => {
  let uid = "XXX"
  let updateUser = {
   email: "test@test.com", password: "12345", role: "user", pets: [],
  }

  let { status, body } = await requester.put(`/api/users/${uid}`).send(updateUser)

  expect(body).to.has.property("error").and.to.be.eq("INTERNAL_ERROR");
  expect(body).to.has.property("message").and.to.be.eq("Error inesperado - reintente en unos minutos o conecte con el administrador");
  expect(status).to.be.eq(400);
 })

 it("Si envío un UID válido, a /api/users/:uid, método DELETE, elimina el usuario de la base de datos y el server responde un status code 200", async () => {
  let { status, body } = await requester.delete(`/api/users/${uid}`);

  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("message").and.to.be.eq("User deleted");
  expect(status).to.be.eq(200);
 })

 it("Si envío un UID inválido, a /api/users/:uid, método DELETE, el server responde con un status code 400.", async () => {
  let uid = "XXX"

  let { status, body } = await requester.delete(`/api/users/${uid}`);

  expect(body).to.has.property("error").and.to.be.eq("INTERNAL_ERROR");
  expect(body).to.has.property("message").and.to.be.eq("Error inesperado - reintente en unos minutos o conecte con el administrador");
  expect(status).to.be.eq(400);
 })
});