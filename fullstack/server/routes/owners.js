import express from 'express';
import { getOwners, createOwner, getOwner, deleteOwner, updateOwner } from '../controllers/owners.js';

const router = express.Router();

router.get('/owners', getOwners);
router.post('/owner', createOwner);
router.get('/owner/:id', getOwner);
router.delete('/owner/:id', deleteOwner);
router.put('/owner/:id', updateOwner);

export default router;