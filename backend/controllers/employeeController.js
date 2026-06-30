import { db } from '../models/Employee.js';

// Helper: validate email address format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


export const getEmployees = async (req, res) => {
  try {
    const { search, department, status, page, limit } = req.query;
    const result = await db.getEmployees({ search, department, status, page, limit });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees: ' + error.message });
  }
};

// GET analytics data
export const getAnalytics = async (req, res) => {
  try {
    const analytics = await db.getAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate analytics: ' + error.message });
  }
};

// CREATE employee
export const createEmployee = async (req, res) => {
  const { name, email, department, designation, status, joiningDate } = req.body;

  // Basic Validation
  if (!name || !email || !department || !designation || !status || !joiningDate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!['Active', 'Inactive', 'On Leave'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Active, Inactive, or On Leave.' });
  }

  try {
    const newEmployee = await db.createEmployee({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      designation: designation.trim(),
      status,
      joiningDate: new Date(joiningDate)
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    if (error.message.includes('already exists')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create employee: ' + error.message });
    }
  }
};

// UPDATE employee
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, department, designation, status, joiningDate } = req.body;

  // Validation
  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (email !== undefined) {
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    updateData.email = email.trim().toLowerCase();
  }
  if (department !== undefined) updateData.department = department.trim();
  if (designation !== undefined) updateData.designation = designation.trim();
  if (status !== undefined) {
    if (!['Active', 'Inactive', 'On Leave'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Active, Inactive, or On Leave.' });
    }
    updateData.status = status;
  }
  if (joiningDate !== undefined) updateData.joiningDate = new Date(joiningDate);

  try {
    const updatedEmployee = await db.updateEmployee(id, updateData);
    res.json(updatedEmployee);
  } catch (error) {
    if (error.message.includes('already exists')) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update employee: ' + error.message });
    }
  }
};

// DELETE employee
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmployee = await db.deleteEmployee(id);
    res.json({ message: 'Employee successfully deleted.', employee: deletedEmployee });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete employee: ' + error.message });
    }
  }
};
