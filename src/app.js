import os from 'os';
import express from 'express';
import cluster from 'cluster';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { middlewareLogger, logger } from "./utils/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import loggerTest from './routes/loggers.router.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import mocksRouter from './routes/mocks.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

import dotenv from 'dotenv';

if(cluster.isPrimary) {
 for(let i=0; i<os.cpus().length; i++) {
  cluster.fork();
 }
} else {
 dotenv.config();
 const app = express();
 const PORT = process.env.PORT||8080;
 const connection = mongoose.connect(process.env.MONGO_URL)

 const swaggerOptions = {
  definition: {
   openapi: "3.0.1",
   info: {
    version: "1.0.0",
    title: "Documentación del poder y del saber",
    description: "API pensada para la clase de swagger",
   },
   servers: [
    {
     url: "http://localhost:8080",
     description: "development"
    },
    {
     url: "http://localhost:3001",
     description: "testing"
    },
    {
     url: "http://localhost:3000",
     description: "production"
    },
   ],
  },
  apis: ["src/docs/**/*.yaml"]
 }
 const specs = swaggerJsdoc(swaggerOptions);
 app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

 app.use(express.json());
 app.use(cookieParser());
 app.use(middlewareLogger);

 app.use('/api/users',usersRouter);
 app.use('/api/pets',petsRouter);
 app.use('/api/adoptions',adoptionsRouter);
 app.use('/api/sessions',sessionsRouter);
 app.use('/loggerTest', loggerTest);
 app.use('/api/mocks', mocksRouter);
 app.use(errorHandler);

 const server = app.listen(PORT,()=>{
  logger.info(`Server escuchando en el puerto ${PORT}`);
 });
};