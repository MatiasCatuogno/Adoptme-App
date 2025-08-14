import fs from 'fs';
import os from 'os';

export const errorHandler = (error, req, res, next) => {
 let logFile = "./src/logs/custom_errors.log";

 let user = os.userInfo().username;
 let host = os.hostname();

 if (fs.existsSync(logFile)) {
  fs.appendFileSync(logFile, "\n" + JSON.stringify({ fecha: new Date(), error: error.message, host, user }))
 } else {
  fs.writeFileSync(logFile, JSON.stringify({ fecha: new Date(), error: error.message, host, user }))
 }

 res.setHeader("Content-Type", "application/json");

 return res.status(400).json({
  error: "INTERNAL_ERROR",
  message: "Error inesperado - reintente en unos minutos o conecte con el administrador",
 });
};