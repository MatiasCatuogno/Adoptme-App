import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import usersController from '../controllers/users.controller.js';

const router = Router();

router.get('/mockingpets',petsController.mockingPets);
router.get('/mockingusers',usersController.mockingUsers);
router.post('/generateData',usersController.generateData);

export default router;