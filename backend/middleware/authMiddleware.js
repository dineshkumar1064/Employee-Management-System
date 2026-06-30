import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_employee_dashboard_key';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Token format: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Session has expired or is invalid. Please log in again.' });
    }
    
    // Attach the user info to request object
    req.user = user;
    next();
  });
}
