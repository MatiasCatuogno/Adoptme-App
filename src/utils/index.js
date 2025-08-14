import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import winston from 'winston';

import dotenv from 'dotenv';

dotenv.config();

export const customLevelsOptions = {
 levels: {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
 },
 colors: {
  fatal: "magenta",
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "green",
  debug: "white",
 }
};

winston.addColors(customLevelsOptions.colors);

const buildLogger = () => {
 if (process.env.NODE_ENV === "production") {
  return winston.createLogger({
   levels: customLevelsOptions.levels,
   transports: [
    new winston.transports.Console({
     level: "info",
     format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
     )
    }),
    new winston.transports.File({
     filename: "./src/logs/winston_errors.log",
     level: "error",
     format: winston.format.simple(),
    }),
   ]
  });
 } else {
  return winston.createLogger({
   levels: customLevelsOptions.levels,
   transports: [
    new winston.transports.Console({
     level: "debug",
     format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
     ),
    }),
   ],
  });
 }
};

const logger = buildLogger();

export const middlewareLogger = (req, res, next) => {
 req.logger = logger;
 req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
 next();
};

export const createHash = async(password) =>{
 const salts = await bcrypt.genSalt(10);
 return bcrypt.hash(password,salts);
};

export const passwordValidation = async(user,password) => bcrypt.compare(password,user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { logger };
export default __dirname;