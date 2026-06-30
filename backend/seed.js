import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_DB_PATH = path.join(__dirname, 'database.json');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employee_db';

const seedEmployees = [
  { name: 'Employee 1', email: 'employee1@test.com', department: 'Engineering', designation: 'Senior Software Engineer', status: 'Active', joiningDate: new Date('2025-10-15') },
  { name: 'Employee 2', email: 'employee2@test.com', department: 'Engineering', designation: 'Frontend Developer', status: 'Active', joiningDate: new Date('2025-10-20') },
  { name: 'Employee 3', email: 'employee3@test.com', department: 'Operations', designation: 'Operations Director', status: 'Active', joiningDate: new Date('2025-10-25') },
  { name: 'Employee 4', email: 'employee4@test.com', department: 'Sales', designation: 'Account Executive', status: 'Inactive', joiningDate: new Date('2025-11-25') },
  { name: 'Employee 5', email: 'employee5@test.com', department: 'Design', designation: 'UI/UX Designer', status: 'Active', joiningDate: new Date('2025-11-27') },
  { name: 'Employee 6', email: 'employee6@test.com', department: 'Management', designation: 'Managing Director', status: 'Active', joiningDate: new Date('2025-12-28') },
  { name: 'Employee 7', email: 'employee7@test.com', department: 'HR', designation: 'HR Lead', status: 'Active', joiningDate: new Date('2026-02-15') },
  { name: 'Employee 8', email: 'employee8@test.com', department: 'Marketing', designation: 'Content Specialist', status: 'On Leave', joiningDate: new Date('2026-02-25') },
  { name: 'Employee 9', email: 'employee9@test.com', department: 'Product', designation: 'Product Manager', status: 'Active', joiningDate: new Date('2026-03-01') },
  { name: 'Employee 10', email: 'employee10@test.com', department: 'Operations', designation: 'Security Head', status: 'Active', joiningDate: new Date('2026-03-05') },
  { name: 'Employee 11', email: 'employee11@test.com', department: 'HR', designation: 'Recruiter', status: 'Active', joiningDate: new Date('2026-04-25') },
  { name: 'Employee 12', email: 'employee12@test.com', department: 'Design', designation: 'Graphic Designer', status: 'On Leave', joiningDate: new Date('2026-04-28') }
];

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Attempt MongoDB Connection
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('🚀 Connected to MongoDB.');

    // Define Employee schema inside seed script to run independently
    const EmployeeSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      department: { type: String, required: true },
      designation: { type: String, required: true },
      status: { type: String, required: true, enum: ['Active', 'Inactive', 'On Leave'] },
      joiningDate: { type: Date, required: true }
    }, { timestamps: true });

    let Employee;
    try {
      Employee = mongoose.model('Employee', EmployeeSchema);
    } catch {
      Employee = mongoose.model('Employee');
    }

    // Drop collection or clear documents to ensure fresh seed
    await Employee.deleteMany({});
    console.log('🧹 Cleared existing MongoDB employees collection.');

    // Seed employees
    await Employee.insertMany(seedEmployees);
    console.log('✅ MongoDB successfully seeded with 12 employee records.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.warn('⚠️  MongoDB seeding failed. Falling back to seeding local database.json...');
    console.warn(`Reason: ${error.message}`);

    // Seed JSON Database fallback
    try {
      const initialData = seedEmployees.map((emp, index) => ({
        id: `emp_${1000 + index}`,
        ...emp,
        joiningDate: emp.joiningDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      await fs.writeFile(JSON_DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      console.log('✅ Local JSON database successfully seeded with 12 employee records.');
      process.exit(0);
    } catch (fsErr) {
      console.error('❌ Failed to seed local JSON database:', fsErr.message);
      process.exit(1);
    }
  }
}

seed();
