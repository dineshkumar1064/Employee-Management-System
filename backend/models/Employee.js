import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbStatus } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_DB_PATH = path.join(__dirname, '..', 'database.json');

// Mongoose Schema Definition
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  status: { type: String, required: true, enum: ['Active', 'Inactive', 'On Leave'] },
  joiningDate: { type: Date, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

let EmployeeModel;
try {
  EmployeeModel = mongoose.model('Employee', EmployeeSchema);
} catch (e) {
  EmployeeModel = mongoose.model('Employee');
}


async function readJsonDb() {
  try {
    const data = await fs.readFile(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeJsonDb(data) {
  await fs.writeFile(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Unified Database API
export const db = {
  isMongo: () => dbStatus.isMongoConnected,

  async getEmployees({ search = '', department = '', status = '', page = 1, limit = 5 }) {
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, parseInt(limit));
    const skip = (parsedPage - 1) * parsedLimit;

    if (dbStatus.isMongoConnected) {
      const query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (department) {
        query.department = department;
      }
      
      if (status) {
        query.status = status;
      }

      const total = await EmployeeModel.countDocuments(query);
      const docs = await EmployeeModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit);
      
      const employees = docs.map(doc => doc.toJSON());
      const pages = Math.ceil(total / parsedLimit);

      return { employees, total, pages, page: parsedPage, limit: parsedLimit };
    } else {
      // JSON Database
      let employees = await readJsonDb();

      // Apply Search
      if (search) {
        const searchLower = search.toLowerCase();
        employees = employees.filter(emp => 
          emp.name.toLowerCase().includes(searchLower) || 
          emp.email.toLowerCase().includes(searchLower)
        );
      }

      // Apply Department Filter
      if (department) {
        employees = employees.filter(emp => emp.department === department);
      }

      // Apply Status Filter
      if (status) {
        employees = employees.filter(emp => emp.status === status);
      }

      // Sort by createdAt descending
      employees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = employees.length;
      const paginatedEmployees = employees.slice(skip, skip + parsedLimit);
      const pages = Math.ceil(total / parsedLimit);

      return { 
        employees: paginatedEmployees, 
        total, 
        pages, 
        page: parsedPage, 
        limit: parsedLimit 
      };
    }
  },

  async getEmployeeById(id) {
    if (dbStatus.isMongoConnected) {
      const doc = await EmployeeModel.findById(id);
      return doc ? doc.toJSON() : null;
    } else {
      const employees = await readJsonDb();
      return employees.find(emp => emp.id === id) || null;
    }
  },

  async createEmployee(data) {
    // Validate email uniqueness
    const existing = await this.getEmployeeByEmail(data.email);
    if (existing) {
      throw new Error(`An employee with email ${data.email} already exists.`);
    }

    if (dbStatus.isMongoConnected) {
      const doc = new EmployeeModel(data);
      await doc.save();
      return doc.toJSON();
    } else {
      const employees = await readJsonDb();
      const newEmp = {
        id: `emp_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      employees.push(newEmp);
      await writeJsonDb(employees);
      return newEmp;
    }
  },

  async updateEmployee(id, data) {
    // Validate email uniqueness (if email is changing)
    if (data.email) {
      const existing = await this.getEmployeeByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new Error(`An employee with email ${data.email} already exists.`);
      }
    }

    if (dbStatus.isMongoConnected) {
      const doc = await EmployeeModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!doc) throw new Error('Employee not found');
      return doc.toJSON();
    } else {
      const employees = await readJsonDb();
      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) throw new Error('Employee not found');

      const updatedEmp = {
        ...employees[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      employees[index] = updatedEmp;
      await writeJsonDb(employees);
      return updatedEmp;
    }
  },

  async deleteEmployee(id) {
    if (dbStatus.isMongoConnected) {
      const doc = await EmployeeModel.findByIdAndDelete(id);
      if (!doc) throw new Error('Employee not found');
      return doc.toJSON();
    } else {
      const employees = await readJsonDb();
      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) throw new Error('Employee not found');

      const deleted = employees.splice(index, 1)[0];
      await writeJsonDb(employees);
      return deleted;
    }
  },

  async getEmployeeByEmail(email) {
    if (dbStatus.isMongoConnected) {
      const doc = await EmployeeModel.findOne({ email });
      return doc ? doc.toJSON() : null;
    } else {
      const employees = await readJsonDb();
      return employees.find(emp => emp.email.toLowerCase() === email.toLowerCase()) || null;
    }
  },

  async getAnalytics() {
    let employees = [];
    if (dbStatus.isMongoConnected) {
      const docs = await EmployeeModel.find({});
      employees = docs.map(doc => doc.toJSON());
    } else {
      employees = await readJsonDb();
    }

    const total = employees.length;
    const active = employees.filter(emp => emp.status === 'Active').length;
    
    // Department breakdown
    const departmentBreakdown = {};
    // Status breakdown
    const statusBreakdown = {};
    // Monthly hires breakdown
    const monthlyHires = {};

    employees.forEach(emp => {
      // Department
      departmentBreakdown[emp.department] = (departmentBreakdown[emp.department] || 0) + 1;
      
      // Status
      statusBreakdown[emp.status] = (statusBreakdown[emp.status] || 0) + 1;

      // Hires month & year (Format: YYYY-MM)
      if (emp.joiningDate) {
        const date = new Date(emp.joiningDate);
        const year = date.getFullYear();
        const monthNum = String(date.getMonth() + 1).padStart(2, '0');
        const monthLabel = date.toLocaleString('default', { month: 'short' }) + ' ' + year;
        const key = `${year}-${monthNum}`;
        if (!monthlyHires[key]) {
          monthlyHires[key] = { sortKey: key, name: monthLabel, count: 0 };
        }
        monthlyHires[key].count += 1;
      }
    });

    // Format department breakdown for charts
    const departmentData = Object.entries(departmentBreakdown).map(([name, value]) => ({
      name,
      value
    }));

    // Format status breakdown for charts
    const statusData = Object.entries(statusBreakdown).map(([name, value]) => ({
      name,
      value
    }));

    // Format monthly hires, sorted chronologically
    const monthlyHiresData = Object.values(monthlyHires)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(item => ({
        name: item.name,
        count: item.count
      }));

    return {
      total,
      active,
      departments: departmentData,
      statuses: statusData,
      monthlyHires: monthlyHiresData
    };
  }
};
