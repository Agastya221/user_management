import { Router } from 'express';
import { registerUser,deleteUser, updateUser, loginUser,logoutUser,getallusers,refreshAccessToken} from '../controllers/user.controller';
import authMiddleware from '../utils/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser );
router.get('/getallusers',authMiddleware,getallusers);
router.get('/refreshtoken', refreshAccessToken);

router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

router.post('/auth', authMiddleware);

export default router;
