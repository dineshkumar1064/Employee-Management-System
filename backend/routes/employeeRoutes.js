import express from 'express';
import {
  getEmployees,
  getAnalytics,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all employee routes
router.use(authenticateToken);

router.get('/', getEmployees);
router.get('/analytics', getAnalytics);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
