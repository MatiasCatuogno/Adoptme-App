import PetDTO from "../dto/Pet.dto.js";
import { CustomError } from '../errors/CustomError.js';
import { errorDictionary } from '../errors/errorDictionary.js';
import { generateMockPets } from '../mocks/pets_mock.js';
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllPets = async(req,res,next)=>{
 try {
  const pets = await petsService.getAll();

  if(!pets) {
   req.logger.error("No se pudo obtener la mascota.");
   throw new CustomError("COULDNT_GET_PETS", errorDictionary.COULDNT_GET_PET);
  }

  req.logger.info("Mascotas obtenidas correctamente");

  res.send({ status:"success", payload:pets });
 } catch (error) {
  req.logger.fatal(`Error en el controller pets, función getAllPets: ${error.message}`);
  next(error);
 }
};

const mockingPets = async(req,res,next)=>{
 try {
  const mockPets = generateMockPets(100);

  if (!mockPets) {
   req.logger.error("Error al crear las mascotas.");
   throw new CustomError("ERROR_CREATING_PETS", errorDictionary.ERROR_CREATING_PETS);
  }

  const pets = await petsService.mockPets(mockPets);

  if (!pets) {
   req.logger.error("Error al insertar las mascotas.");
   throw new CustomError("ERROR_INSERT_PETS", errorDictionary.ERROR_INSERT_PETS);
  }

  req.logger.info("Mascotas creadas correctamente");

  res.send({ status:"success", payload:pets });
 } catch (error) {
  req.logger.fatal(`Error en el controller pets, función mockingPets: ${error.message}`);
  next(error);
 }
};

const createPet = async(req,res,next)=>{
 try {
  const {name,specie,birthDate} = req.body;

  if(!name||!specie||!birthDate) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  }

  const pet = PetDTO.getPetInputFrom({name,specie,birthDate});

  if(!pet) {
   req.logger.error("Datos de mascota inválidos.");
   throw new CustomError("INVALID_PET_DATA", errorDictionary.INVALID_PET_DATA);
  }

  const result = await petsService.create(pet);

  if(!result) {
   req.logger.error("No se pudo crear la mascota.");
   throw new CustomError("COULDNT_CREATE_PET", errorDictionary.COULDNT_CREATE_PET);
  }

  req.logger.info("Mascota creada correctamente");

  res.send({ status:"success", payload:result });
 } catch (error) {
  req.logger.fatal(`Error en el controller pets, función createPet: ${error.message}`);
  next(error);
 }
};

const updatePet = async(req,res,next)=>{
 try {
  const petUpdateBody = req.body;
  const petId = req.params.pid;

  if(!petUpdateBody || !petId) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  }

  const result = await petsService.update(petId,petUpdateBody);
  
  if(!result) {
   req.logger.error("No se pudo actualizar los datos de la mascota.");
   throw new CustomError("COULDNT_UPDATE_PET", errorDictionary.COULDNT_UPDATE_PET);
  }

  req.logger.info("Mascota actualizada correctamente");

  res.send({ status:"success", message:"pet updated" });
 } catch (error) {
  req.logger.fatal(`Error en el controller pets, función updatePet: ${error.message}`);
  next(error);
 }
};

const deletePet = async(req,res,next)=>{
 try {
  const petId = req.params.pid;

  if(!petId) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  }

  const result = await petsService.delete(petId);

  if(!result) {
   req.logger.error("No se pudo eliminar la mascota.");
   throw new CustomError("COULDNT_DELETE_PET", errorDictionary.COULDNT_DELETE_PET);
  }

  req.logger.info("Mascota eliminada correctamente");

  res.send({ status:"success", message:"pet deleted" });
 } catch (error) {
  req.logger.fatal(`Error en el controller pets, función deletePet: ${error.message}`);
  next(error);
 }
};

const createPetWithImage = async(req,res,next)=>{
 try {
  const file = req.file;

  if(!file) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  }

  const {name,specie,birthDate} = req.body;

  if(!name||!specie||!birthDate) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  }

  console.log(file);

  const pet = PetDTO.getPetInputFrom({
   name,
   specie,
   birthDate,
   image:`${__dirname}/../public/img/${file.filename}`
  });

  console.log(pet);

  const result = await petsService.create(pet);

  if(!result) {
   req.logger.error("No se pudo crear la mascota.");
   throw new CustomError("COULDNT_CREATE_PET", errorDictionary.COULDNT_CREATE_PET);
  }

  req.logger.info("Mascota creada correctamente");

  res.send({ status:"success", payload:result });
 } catch (error) {
  req.logger.fatal(`Error en el controller pets, función createPetWithImage: ${error.message}`);
  next(error);
 }
};

export default { getAllPets, mockingPets, createPet, updatePet, deletePet, createPetWithImage };