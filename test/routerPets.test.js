import { expect } from "chai";
import supertest from "supertest";
import { describe, it, after } from "mocha";

import mongoose, { isValidObjectId } from "mongoose";

const requester = supertest("http://localhost:8080");

try {
 await mongoose.connect(process.env.MONGO_URL)
} catch (error) {
 console.log(error)
}

describe("Pruebas router Mascotas", function () {
 this.timeout(10_000);

 let pid = "6860652ac7a4654ce0f302b1"; // Reemplazar con un PID válido de una mascota en la base de datos.

 after(async () => {
  await mongoose.connection.collection("pets").drop();
 })

 it("Si ejecuto con método GET a la ruta /api/pets, el server responde con un objeto con la property status con el valor success y el payload con un array de mascotas.", async () => {
  let { status, body } = await requester.get("/api/pets")

  expect(status).to.be.eq(200);
  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("payload");
  expect(Array.isArray(body.payload)).to.be.eq(true);

  if(Array.isArray(body.payload) && body.payload.length > 0) {
   expect(body.payload[0]._id).to.be.ok;
   expect(isValidObjectId(body.payload[0]._id)).to.be.true;
  }
 })

 it("Si envío datos de una mascota válidos con método POST a /api/pets, graba la mascota en DB. y el server responde un status code 200", async () => {
  let petMock = {
   name: "marshall", specie: "dog", birthDate: "2019-02-12"
  }

  let { status, body } = await requester.post("/api/pets").send(petMock);

  expect(status).to.be.eq(200);
  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("payload");
  expect(body.payload).to.has.property("_id");
  expect(body.payload).to.has.property("name").and.to.be.eq(petMock.name);
  expect(body.payload).to.has.property("specie").and.to.be.eq(petMock.specie);
  expect(isValidObjectId(body.payload._id)).to.be.true;
 })

 it("Si envío datos de una mascota inválidos con método POST a /api/pets, el server responde con un status code 400.", async () => {
  let petMock = {
   specie: "dog", birthDate: "2019-02-12"
  }

  let { status } = await requester.post("/api/pets").send(petMock);

  expect(status).to.be.eq(400);
 })

 it("Si envío datos de una mascota válidos con método POST a /api/pets/withImage, graba la mascota con imágen en DB. y el server responde un status code 200", async () => {
  let petMock = {
   name: "Roger", specie: "Rabbit", birthDate: "2019-02-12"
  }

  let { status, body } = await requester.post("/api/pets/withImage")
                                .field("name", petMock.name)
                                .field("specie", petMock.specie)
                                .field("birthDate", petMock.birthDate)
                                .attach("petImage", "./src/public/pets/coderDog.jpg")

  expect(status).to.be.eq(200);
  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("payload");
  expect(body.payload).to.has.property("_id");
  expect(isValidObjectId(body.payload._id)).to.be.true;
  expect(body.payload).to.has.property("name").and.to.be.eq(petMock.name);
  expect(body.payload).to.has.property("specie").and.to.be.eq(petMock.specie);
  expect(body.payload).to.has.property("birthDate").and.to.be.ok;
 })

 it("Si envío datos de una mascota inválidos con método POST a /api/pets/withImage, el server responde con un status code 400.", async () => {
  let petMock = {
   specie: "Rabbit", birthDate: "2019-02-12"
  }

  let { status } = await requester.post("/api/pets/withImage")
                                .field("specie", petMock.specie)
                                .field("birthDate", petMock.birthDate)
                                .attach("petImage", "./src/public/pets/coderDog.jpg")

  expect(status).to.be.eq(400);
 })

 it("Si envío los datos de una mascota y PID válidos con método PUT a /api/pets/:pid actualiza la mascota en DB. y el server responde un status code 200", async () => {
  let updatePet = {
   name: "Juancito Arcoíris", specie: "avestruz", birthDate: "2025-02-12"
  }

  let { status, body } = await requester.put(`/api/pets/${pid}`).send(updatePet)

  expect(status).to.be.eq(200);
  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("message").and.to.be.eq("pet updated");
 })

 it("Si envío los datos de una mascota o PID inválidos, a /api/pets/:pid, método PUT, el server responde con un status code 400.", async () => {
  let pid = "XXX"
  let updatePet = {
   name: "Juancito Arcoíris", specie: "Dog", birthDate: "2025-02-12"
  }

  let { status, body } = await requester.put(`/api/pets/${pid}`).send(updatePet)

  expect(body).to.has.property("error").and.to.be.eq("INTERNAL_ERROR");
  expect(body).to.has.property("message").and.to.be.eq("Error inesperado - reintente en unos minutos o conecte con el administrador");
  expect(status).to.be.eq(400);
 })

 it("Si envío un PID válido con método DELETE a /api/pets/:pid, elimina la mascota de la base de datos y el server responde un status code 200", async () => {
  let { status, body } = await requester.delete(`/api/pets/${pid}`);

  expect(body).to.has.property("status").and.to.be.eq("success");
  expect(body).to.has.property("message").and.to.be.eq("pet deleted");
  expect(status).to.be.eq(200);
 })

 it("Si envío un PID inválido con método DELETE a /api/pets/:pid, el server responde con un status code 400.", async () => {
  let pid = "XXX"

  let { status, body } = await requester.delete(`/api/pets/${pid}`);

  expect(body).to.has.property("error").and.to.be.eq("INTERNAL_ERROR");
  expect(body).to.has.property("message").and.to.be.eq("Error inesperado - reintente en unos minutos o conecte con el administrador");
  expect(status).to.be.eq(400);
 })
});