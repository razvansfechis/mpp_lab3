import express from 'express';
import { getCars, createCar, getCar, deleteCar, updateCar } from '../controllers/cars.js';

const router = express.Router();

router.get('/cars', getCars);
router.post('/car', createCar);
router.get('/car/:id', getCar);
router.delete('/car/:id', deleteCar);
router.put('/car/:id', updateCar);

export default router;