import express from 'express';
import authRoutes from './authRoutes.js';
import employeeRoutes from './employeeRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);

export default router;
