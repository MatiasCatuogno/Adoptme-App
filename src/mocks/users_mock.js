import { fakerES_MX as fa } from "@faker-js/faker";
import { createHash } from '../utils/index.js';

export const generateMockUsers = async (quantity) => {
 const users = [];
 const hashedPassword = await createHash("coder123");

 for (let i=0; i<quantity; i++){
  users.push({
   first_name: fa.person.firstName(),
   last_name: fa.person.lastName(),
   email: fa.internet.email(),
   password: hashedPassword,
   role: Math.random() < 0.5 ? "user" : "admin",
   pets: [],
  });
 }

 return users;
};