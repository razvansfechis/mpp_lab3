import Car from '../models/cars.js';
import { v4 as uuid } from 'uuid';
import xss from 'xss';

export const getCar = async (req, res) => {
  try {
    const singleCar = await Car.findByPk(req.params.id);
    if (!singleCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(singleCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const sortParam = xss(req.query.sort); // Sanitize input
    const cars = await Car.findAll();
    let sortedCars = cars;

    if (sortParam && sortParam.toUpperCase() === 'DESC') {
      sortedCars = cars.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else {
      sortedCars = cars.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }

    res.status(200).json(sortedCars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCar = async (req, res) => {
  const { name, brand, price, ownerId } = req.body;
  try {
    const newCar = await Car.create({ 
      id: uuid(),
      name: xss(name), // Sanitize input
      brand: xss(brand), // Sanitize input
      price: xss(price), // Sanitize input
      ownerId: xss(ownerId) // Sanitize input
    });
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const { name, brand, price, ownerId } = req.body;
    car.name = xss(name); // Sanitize input
    car.brand = xss(brand); // Sanitize input
    car.price = xss(price); // Sanitize input
    car.ownerId = xss(ownerId); // Sanitize input

    await car.save();
    res.status(200).json(car);
  } catch (error) {
    console.error(error); // Add this line
    res.status(500).json({ message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await car.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error); // Add this line
    res.status(500).json({ message: error.message });
  }
};