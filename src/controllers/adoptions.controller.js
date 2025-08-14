import { CustomError } from "../errors/CustomError.js";
import { errorDictionary } from "../errors/errorDictionary.js";
import { adoptionsService, petsService, usersService } from "../services/index.js";

const getAllAdoptions = async(req,res,next)=>{
 try {
  const result = await adoptionsService.getAll();

  if(!result) {
   req.logger.error("No se encontraron adopciónes.");
   throw new CustomError("ADOPTIONS_NOT_FOUND", errorDictionary.ADOPTIONS_NOT_FOUND);
  }

  req.logger.info("Adopciones obtenidas correctamente");

  res.send({ status:"success", payload:result });
 } catch (error) {
  req.logger.fatal(`Error en el controller adoptions, función getAllAdoptions: ${error.message}`);
  next(error);
 }
};

const getAdoption = async(req,res,next)=>{
 try {
  const adoptionId = req.params.aid;
  const adoption = await adoptionsService.getBy({_id:adoptionId})

  if(!adoption) {
   req.logger.error("No se encontró la adopción.");
   throw new CustomError("ADOPTION_NOT_FOUND", errorDictionary.ADOPTION_NOT_FOUND);
  }

  req.logger.info("Adopción obtenida correctamente");

  res.send({ status:"success", payload:adoption });
 } catch (error) {
  req.logger.fatal(`Error en el controller adoptions, función getAdoption: ${error.message}`);
  next(error);
 }
};

const createAdoption = async(req,res,next)=>{
 try {
  const {uid,pid} = req.params;

  if(!uid || !pid) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  }

  const user = await usersService.getUserById(uid);

  if(!user) {
   req.logger.error("No se encontro el usuario.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND);
  }

  const pet = await petsService.getBy({_id:pid});

  if(!pet) {
   req.logger.error("Mascota no encontrada.");
   throw new CustomError("PET_NOT_FOUND", errorDictionary.PET_NOT_FOUND);
  }

  if(pet.adopted) {
   req.logger.error("La mascota ya ha sido adoptada.");
   throw new CustomError("PET_ALREADY_ADOPTED", errorDictionary.PET_ALREADY_ADOPTED);
  }

  user.pets.push(pet._id);

  await usersService.update(user._id,{ pets:user.pets })
  await petsService.update(pet._id,{ adopted:true,owner:user._id })
  await adoptionsService.create({ owner:user._id,pet:pet._id })

  req.logger.info("Adopción creada correctamente");

  res.send({ status:"success",message:"Pet adopted" })
 } catch (error) {
  req.logger.fatal(`Error en el controller adoptions, función createAdoption: ${error.message}`);
  next(error);
 }
};

export default { createAdoption, getAllAdoptions, getAdoption };