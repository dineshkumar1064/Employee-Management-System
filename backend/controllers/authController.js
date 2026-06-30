import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_employee_dashboard_key';

// Mock credentials definition
const VALID_CREDENTIALS = [
  { email: 'admin@test.com', password: 'password123', name: 'System Admin', role: 'Admin' },
  { email: 'manager@test.com', password: 'password123', name: 'HR Manager', role: 'Manager' }
];

// Helper: validate email address format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Authentication login controller
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const user = VALID_CREDENTIALS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Generate JWT token (expires in 24h)
  const token = jwt.sign(
    { email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
};

// Verify token / check user details controller
export const getMe = (req, res) => {
  res.json({ user: req.user });
};
