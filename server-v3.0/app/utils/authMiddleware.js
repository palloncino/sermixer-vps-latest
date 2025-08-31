import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Adjust the import to your Sequelize User model

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  // Debug logging
  console.log('Auth Header:', authHeader);
  console.log('Extracted Token:', token?.substring(0, 20) + '...');

  if (!token) {
    console.log('No token provided');
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Token decoded successfully, user ID:', decoded.id);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(403).json({ message: 'User not found' });
    }

    console.log('Auth successful for user:', user.email);
    // Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    console.log('JWT verification failed:', error.message);
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
};

export default authMiddleware;
