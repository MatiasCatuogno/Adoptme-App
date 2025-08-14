import { usersService } from "../services/index.js"
import { CustomError } from '../errors/CustomError.js';
import { errorDictionary } from '../errors/errorDictionary.js';

const getAllUsers = async(req,res,next)=>{
 try {
  const users = await usersService.getAll();

  if(!users) {
   req.logger.error("No se encontraron usuarios.");
   throw new CustomError("USERS_NOT_FOUND", errorDictionary.USERS_NOT_FOUND);
  }

  req.logger.info("Usuarios obtenidos correctamente");

  res.send({ status:"success", payload:users });
 } catch (error) {
  req.logger.fatal(`Error en el controller users, función getAllUsers: ${error.message}`);
  next(error);
 }
};

const getUser = async(req,res,next)=> {
 try {
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);

  if(!user) {
   req.logger.error("No se encontró el usuario.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND);
  }

  req.logger.info("Usuario obtenido correctamente");

  res.send({ status:"success", payload:user });
 } catch (error) {
  req.logger.fatal(`Error en el controller users, función getUser: ${error.message}`);
  next(error);
 }
};

const postUserDocuments = async (req, res, next) => {
 try {
  const { uid } = req.params;
  const files = req.files;

  if(!uid || !files || files.length === 0) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  }

  const user = await usersService.getUserById(uid);

  if(!user) {
   req.logger.error("Usuario no encontrado.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND);
  }

  const documents = files.map(file => ({
   name: file.originalname,
   reference: file.path,
  }));

  const updatedUser = await usersService.addDocuments(uid, documents);

  if(!updatedUser) {
   req.logger.error("No se pudo agregar el documento al usuario.");
   throw new CustomError("COULDN'T_ADD_DOCUMENT", errorDictionary.COULDNT_ADD_DOCUMENT);
  }

  req.logger.info(`Documentos ${documents.map(doc => doc.name).join(", ")} agregados correctamente al usuario con ID ${uid}`);

  res.send({ status:"success", payload:documents });
 } catch (error) {
  req.logger.fatal(`Error en el controller users, función postUserDocuments: ${error.message}`);
  next(error);
 }
};

const updateUser = async(req,res,next)=>{
 try {
  const updateBody = req.body;
  const userId = req.params.uid;

  if(!updateBody || !userId) {
   req.logger.error("Datos de usuario inválidos.");
   throw new CustomError("INVALID_USER_DATA", errorDictionary.INVALID_USER_DATA);
  }

  const user = await usersService.getUserById(userId);

  if(!user) {
   req.logger.error("No se encontro el usuario.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND);
  }

  const result = await usersService.update(userId,updateBody);

  if(!result) {
   req.logger.error("No se pudo actualizar el usuario.");
   throw new CustomError("COULDNT_UPDATE_USER", errorDictionary.COULDNT_UPDATE_USER);
  }

  req.logger.info("Usuario actualizado correctamente");

  res.send({ status:"success", message:"User updated" });
 } catch (error) {
  req.logger.fatal(`Error en el controller users, función updateUser: ${error.message}`);
  next(error);
 }
};

const deleteUser = async(req,res,next)=>{
 try {
  const userId = req.params.uid;
  const result = await usersService.getUserById(userId);

  if(!result) {
   req.logger.error("No se encontro el usuario.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND)
  }

  req.logger.info("Usuario eliminado correctamente");

  res.send({ status:"success", message:"User deleted" });
 } catch (error) {
  req.logger.fatal(`Error en el controller users, función deleteUser: ${error.message}`);
  next(error);
 }
};

export default { deleteUser, getAllUsers, getUser, updateUser, postUserDocuments };