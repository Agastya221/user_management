import { Router } from 'express';
import { registerUser,deleteUser, updateUser, loginUser,logoutUser,getallusers } from '../controllers/user.controller';
import authMiddleware from '../utils/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser );
router.get('/getallusers',getallusers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

// Example of a protected route
router.get('/', authMiddleware);

export default router;
