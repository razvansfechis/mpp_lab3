import { v4 as uuid } from 'uuid';
import request from 'supertest';
import app from '../index.js';
import Owner from '../models/owner.js';
import Car from '../models/cars.js';

describe('Owners API', () => {
  let ownerId;
  let carId;

  beforeAll(async () => {
    ownerId = uuid();
    carId = uuid();
    
    // Create a car to ensure there are no foreign key issues
    await Owner.create({ id: ownerId, name: 'Owner for Car', email: 'ownerforcar@example.com' });
    await Car.create({ id: carId, name: 'Test Car', brand: 'Test Brand', price: '10000', ownerId });
  });

  afterAll(async () => {
    await Car.destroy({ where: {} });
    await Owner.destroy({ where: {} });
  });

  describe('GET /owner/:id', () => {
    it('should return an owner by ID', async () => {
      const mockOwner = { id: uuid(), name: 'Test Owner', email: 'test@example.com' };
      await Owner.create(mockOwner);

      const res = await request(app).get(`/owner/${mockOwner.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(mockOwner));
    });

    it('should return 404 if owner not found', async () => {
      const res = await request(app).get(`/owner/${uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Owner not found' });
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Owner, 'findByPk').mockRejectedValue(new Error('Server error'));

      const res = await request(app).get(`/owner/${uuid()}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });

      Owner.findByPk.mockRestore();
    });
  });

  describe('GET /owners', () => {
    it('should return a list of owners', async () => {
      const mockOwners = [
        { id: uuid(), name: 'Owner 1', email: 'owner1@example.com' },
        { id: uuid(), name: 'Owner 2', email: 'owner2@example.com' }
      ];
      await Owner.bulkCreate(mockOwners);

      const res = await request(app).get('/owners');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body).toEqual(expect.arrayContaining([
        expect.objectContaining(mockOwners[0]),
        expect.objectContaining(mockOwners[1]),
      ]));
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Owner, 'findAll').mockRejectedValue(new Error('Server error'));

      const res = await request(app).get('/owners');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });

      Owner.findAll.mockRestore();
    });
  });

  describe('POST /owner', () => {
    it('should create a new owner', async () => {
      const newOwner = { name: 'New Owner', email: 'newowner@example.com' };

      const res = await request(app)
        .post('/owner')
        .send(newOwner);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining(newOwner));
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Owner, 'create').mockRejectedValue(new Error('Server error'));

      const res = await request(app)
        .post('/owner')
        .send({ name: 'New Owner', email: 'newowner@example.com' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });

      Owner.create.mockRestore();
    });
  });

  describe('PUT /owner/:id', () => {
    it('should update an existing owner', async () => {
      const mockOwner = { id: uuid(), name: 'Old Owner', email: 'oldowner@example.com' };
      await Owner.create(mockOwner);

      const updatedOwner = { name: 'Updated Owner', email: 'updatedowner@example.com' };

      const res = await request(app)
        .put(`/owner/${mockOwner.id}`)
        .send(updatedOwner);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(updatedOwner));
    });

    it('should return 404 if owner not found', async () => {
      const res = await request(app)
        .put(`/owner/${uuid()}`)
        .send({ name: 'Updated Owner', email: 'updatedowner@example.com' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Owner not found' });
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Owner, 'findByPk').mockRejectedValue(new Error('Server error'));

      const res = await request(app)
        .put(`/owner/${uuid()}`)
        .send({ name: 'Updated Owner', email: 'updatedowner@example.com' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });

      Owner.findByPk.mockRestore();
    });
  });

  describe('DELETE /owner/:id', () => {
    it('should delete an existing owner', async () => {
      const mockOwner = { id: uuid(), name: 'Test Owner', email: 'test@example.com' };
      await Owner.create(mockOwner);

      const res = await request(app).delete(`/owner/${mockOwner.id}`);

      expect(res.status).toBe(204);
    });

    it('should return 404 if owner not found', async () => {
      const res = await request(app).delete(`/owner/${uuid()}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Owner not found' });
    });

    it('should return 400 if owner has cars', async () => {
      const mockOwner = { id: uuid(), name: 'Owner with Car', email: 'ownerwithcar@example.com' };
      await Owner.create(mockOwner);
      await Car.create({ id: uuid(), name: 'Test Car', brand: 'Test Brand', price: '10000', ownerId: mockOwner.id });

      const res = await request(app).delete(`/owner/${mockOwner.id}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Owner cannot be deleted because they own a car' });
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(Owner, 'findByPk').mockRejectedValue(new Error('Server error'));

      const res = await request(app).delete(`/owner/${uuid()}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });

      Owner.findByPk.mockRestore();
    });
  });
});