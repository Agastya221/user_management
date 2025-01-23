import { Router } from 'express';
import { registerUser,deleteUser, updateUser, loginUser,logoutUser,getallusers,refreshAccessToken} from '../controllers/user.controller';
import authMiddleware from '../utils/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser );
router.get('/getallusers',authMiddleware,getallusers);
router.get('/refreshtoken', refreshAccessToken);

router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

router.get('/auth', authMiddleware);

export default router;
