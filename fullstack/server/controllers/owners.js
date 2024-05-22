import Owner from '../models/owner.js';
import Car from '../models/cars.js';
import { v4 as uuid } from 'uuid';
import xss from 'xss';

export const getOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll();
    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwner = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOwner = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newOwner = await Owner.create({
      id: uuid(),
      name: xss(name), // Sanitize input
      email: xss(email) // Sanitize input
    });
    res.status(201).json(newOwner);
  } catch (error) {
    console.error(error); // Add this line
    res.status(500).json({ message: error.message });
  }
};

export const updateOwner = async (req, res) => {
  try {
    const { name, email } = req.body;
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    owner.name = xss(name); // Sanitize input
    owner.email = xss(email); // Sanitize input
    await owner.save();
    res.status(200).json(owner);
  } catch (error) {
    console.error(error); // Add this line
    res.status(500).json({ message: error.message });
  }
};

export const deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByPk(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const cars = await Car.findAll({ where: { ownerId: owner.id } });
    if (cars.length > 0) {
      return res.status(400).json({ message: 'Owner cannot be deleted because they own a car' });
    }

    await owner.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error); // Ensure this logs the actual error
    res.status(500).json({ message: error.message });
  }
};