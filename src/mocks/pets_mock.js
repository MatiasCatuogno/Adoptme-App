import { fakerES_MX as fa } from "@faker-js/faker";

export const generateMockPets = (quantity) => {
 const pets = [];
 for (let i=0; i<quantity; i++){
  pets.push({
   name: fa.animal.petName(),
   specie: fa.animal.type(),
   birthDate: fa.date.birthdate(),
   adopted: false,
   image: fa.image.url(),
  });
 }

 return pets;
};