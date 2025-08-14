import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import { CustomError } from "../errors/CustomError.js";
import { errorDictionary } from "../errors/errorDictionary.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';

const register = async (req, res, next) => {
 try {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  };

  const exists = await usersService.getUserByEmail(email);

  if (exists) {
   req.logger.error("El usuario ya está registrado.");
   throw new CustomError("USER_ALREADY_EXISTS", errorDictionary.USER_ALREADY_EXISTS);
  };

  const hashedPassword = await createHash(password);

  if (!hashedPassword) {
   req.logger.error("Error al hashear la contraseña.");
   throw new CustomError("ERROR_HASHING_PASSWORD", errorDictionary.ERROR_HASHING_PASSWORD);
  };

  const user = {
   first_name,
   last_name,
   email,
   password: hashedPassword
  };

  let result = await usersService.create(user);

  console.log(result);

  if (!result) {
   req.logger.error("No se pudo crear el usuario.");
   throw new CustomError("COULDNT_CREATE_USER", errorDictionary.COULDNT_CREATE_USER);
  };

  req.logger.info("Usuario registrado correctamente");

  res.send({ status: "success", payload: result._id });
 } catch (error) {
  req.logger.fatal(`Error en el controller sessions, función register: ${error.message}`);
  next(error);
 }
};

const login = async (req,res,next) => {
 try {
  const { email, password } = req.body;

  if (!email || !password) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  };

  const user = await usersService.getUserByEmail(email);

  if(!user) {
   req.logger.error("No se encontro el usuario.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND);
  };
  
  const isValidPassword = await passwordValidation(user,password);

  if(!isValidPassword) {
   req.logger.error("Datos de usuario inválidos.");
   throw new CustomError("INVALID_USER_DATA", errorDictionary.INVALID_USER_DATA);
  };

  await usersService.update(user._id, { last_connection: new Date() });
  const updatedUser = await usersService.getUserByEmail(email);

  // console.log("última conexion desde el login: ", updatedUser.last_connection);
  const userDto = UserDTO.getUserTokenFrom(updatedUser);
  const token = jwt.sign(userDto,'tokenSecretJWT',{expiresIn:"1h"});

  if(!token) {
   req.logger.error("Error al generar el token.");
   throw new CustomError("GENERATE_TOKEN_ERROR", errorDictionary.GENERATE_TOKEN_ERROR);
  };

  req.logger.info("Usuario logeado correctamente");

  res.cookie('coderCookie',token,{maxAge:3600000}).send({ status:"success", message:"Logged in" });
 } catch (error) {
  req.logger.fatal(`Error en el controller sessions, función login: ${error.message}`);
  next(error);
 }
};

const logout = async (req, res, next) => {
 try {
  const cookie = req.cookies['coderCookie'];

  if (!cookie) {
   return res.status(400).send({ status: "error", message: "No hay sesión activa" });
  }

  const userData = jwt.verify(cookie, 'tokenSecretJWT');
  await usersService.update(userData._id, { last_connection: new Date() });

  req.logger.info("Usuario deslogeado correctamente");

  res.clearCookie('coderCookie');
  res.send({ status: "success", message: "Logout exitoso" });
 } catch (error) {
  next(error);
 }
};

const current = async(req,res,next) =>{
 try {
  const cookie = req.cookies['coderCookie']
  const user = jwt.verify(cookie,'tokenSecretJWT');

  if(!user) {
   req.logger.error("No se encontró el usuario.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND);
  }

  req.logger.info("Usuario logueado correctamente");

  return res.send({ status:"success", payload:user });
 } catch (error) {
  req.logger.fatal(`Error en el controller sessions, función current: ${error.message}`);
  next(error);
 }
};

const unprotectedLogin = async(req,res,next) =>{
 try {
  const { email, password } = req.body;

  if (!email || !password) {
   req.logger.error("Valores Incompletos.");
   throw new CustomError("INCOMPLETED_VALUES", errorDictionary.INCOMPLETED_VALUES);
  };

  const user = await usersService.getUserByEmail(email);

  if(!user) {
   req.logger.error("No se encontro el usuario.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND);
  };

  const isValidPassword = await passwordValidation(user,password);

  if(!isValidPassword) {
   req.logger.error("Datos de usuario inválidos.");
   throw new CustomError("INVALID_USER_DATA", errorDictionary.INVALID_USER_DATA);
  };

  const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});

  if(!token) {
   req.logger.error("Error al generar el token.");
   throw new CustomError("GENERATE_TOKEN_ERROR", errorDictionary.GENERATE_TOKEN_ERROR);
  };

  req.logger.info("Usuario logueado correctamente");

  res.cookie('unprotectedCookie', token, {maxAge:3600000}).send({ status:"success", message:"Unprotected Logged in" });
 } catch (error) {
  req.logger.fatal(`Error en el controller sessions, función unprotectedLogin: ${error.message}`);
  next(error);
 }
};

const unprotectedCurrent = async(req,res,next)=>{
 try {
  const cookie = req.cookies['unprotectedCookie']
  const user = jwt.verify(cookie,'tokenSecretJWT');

  if(!user) {
   req.logger.error("No se encontró el usuario.");
   throw new CustomError("USER_NOT_FOUND", errorDictionary.USER_NOT_FOUND);
  }

  req.logger.info("Usuario logueado correctamente");

  return res.send({ status:"success", payload:user });
 } catch (error) {
  req.logger.fatal(`Error en el controller sessions, función unprotectedCurrent: ${error.message}`);
  next(error);
 }
};

export default { current, login, logout, register, current, unprotectedLogin, unprotectedCurrent };