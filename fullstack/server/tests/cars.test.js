import request from 'supertest';
import app from '../index.js';
import Car from '../models/cars.js';
import { v4 as uuid } from 'uuid';

jest.mock('../models/cars.js');

describe('Cars API', () => {
  describe('GET /car/:id', () => {
    it('should return a car by ID', async () => {
      const carId = uuid();
      const mockCar = { 
        id: carId, 
        name: 'Test Car', 
        brand: 'Test Brand', 
        price: '10000', 
        ownerId: uuid(),
      };
      Car.findByPk.mockResolvedValue(mockCar);
    
      const res = await request(app).get(`/car/${carId}`);
    
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCar); // Ensure no mock functions are in the mockCar
    });

    it('should return 404 if car not found', async () => {
      Car.findByPk.mockResolvedValue(null);

      const res = await request(app).get(`/car/${uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Car not found' });
    });

    it('should return 500 on server error', async () => {
      Car.findByPk.mockRejectedValue(new Error('Server error'));

      const res = await request(app).get(`/car/${uuid()}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('GET /cars', () => {
    it('should return a list of cars', async () => {
      const mockCars = [
        { id: uuid(), name: 'Car 1', brand: 'Brand 1', price: '10000', ownerId: uuid() },
        { id: uuid(), name: 'Car 2', brand: 'Brand 2', price: '20000', ownerId: uuid() }
      ];
      Car.findAll.mockResolvedValue(mockCars);
  
      const res = await request(app).get('/cars');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCars);
    });
  
    it('should return sorted list of cars in descending order by price', async () => {
      const mockCars = [
        { id: uuid(), name: 'Car A', brand: 'Brand A', price: '10000', ownerId: uuid() },
        { id: uuid(), name: 'Car B', brand: 'Brand B', price: '20000', ownerId: uuid() }
      ];
      Car.findAll.mockResolvedValue(mockCars);
    
      const res = await request(app).get('/cars?sort=DESC');
    
      expect(res.status).toBe(200);
      const sortedCars = mockCars.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      expect(res.body).toEqual(sortedCars); // Ensure the mockCars are sorted correctly
    });

    it('should return sorted list of cars in descending order', async () => {
      const mockCars = [
        { id: uuid(), name: 'Car B', brand: 'Brand B', price: '20000', ownerId: uuid() },
        { id: uuid(), name: 'Car A', brand: 'Brand A', price: '10000', ownerId: uuid() }
      ];
      Car.findAll.mockResolvedValue(mockCars);
    
      const res = await request(app).get('/cars?name=DESC');
    
      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockCars[0], mockCars[1]]); // Correct sorting order
    });

    it('should return 500 on server error', async () => {
      Car.findAll.mockRejectedValue(new Error('Server error'));

      const res = await request(app).get('/cars');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /car', () => {
    it('should create a new car', async () => {
      const newCar = { name: 'New Car', brand: 'New Brand', price: '15000', ownerId: uuid() };
      const createdCar = { ...newCar, id: uuid() };
      Car.create.mockResolvedValue(createdCar);

      const res = await request(app)
        .post('/car')
        .send(newCar);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdCar);
    });

    it('should return 500 on server error', async () => {
      Car.create.mockRejectedValue(new Error('Server error'));

      const res = await request(app)
        .post('/car')
        .send({ name: 'New Car', brand: 'New Brand', price: '15000', ownerId: uuid() });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('PUT /car/:id', () => {
    it('should update an existing car', async () => {
      const carId = uuid();
      const mockCar = { 
        id: carId, 
        name: 'Old Car', 
        brand: 'Old Brand', 
        price: '10000', 
        ownerId: uuid(),
        save: jest.fn().mockResolvedValue()
      };
      Car.findByPk.mockResolvedValue(mockCar);
    
      const updatedCar = { name: 'Updated Car', brand: 'Updated Brand', price: '20000', ownerId: uuid() };
    
      const res = await request(app)
        .put(`/car/${carId}`)
        .send(updatedCar);
    
      // Create the expected result object without the `save` method
      const expectedCar = { ...mockCar, ...updatedCar };
      delete expectedCar.save;
    
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expectedCar);
    });

    it('should return 404 if car not found', async () => {
      Car.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put(`/car/${uuid()}`)
        .send({ name: 'Updated Car', brand: 'Updated Brand', price: '20000', ownerId: uuid() });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Car not found' });
    });

    it('should return 500 on server error', async () => {
      Car.findByPk.mockRejectedValue(new Error('Server error'));

      const res = await request(app)
        .put(`/car/${uuid()}`)
        .send({ name: 'Updated Car', brand: 'Updated Brand', price: '20000', ownerId: uuid() });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('DELETE /car/:id', () => {
    it('should delete an existing car', async () => {
      const carId = uuid();
      const mockCar = { 
        id: carId, 
        name: 'Test Car', 
        brand: 'Test Brand', 
        price: '10000', 
        ownerId: uuid(),
        destroy: jest.fn(), // Mock destroy method
      };
      Car.findByPk.mockResolvedValue(mockCar);

      const res = await request(app).delete(`/car/${carId}`);

      expect(res.status).toBe(204);
    });

    it('should return 404 if car not found', async () => {
      Car.findByPk.mockResolvedValue(null);

      const res = await request(app).delete(`/car/${uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Car not found' });
    });

    it('should return 500 on server error', async () => {
      Car.findByPk.mockRejectedValue(new Error('Server error'));

      const res = await request(app).delete(`/car/${uuid()}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });
});