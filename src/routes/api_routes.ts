import { Router } from 'express';
import { login_user, register_user } from '../controllers/users/authenticate';
import { auth_user, get_current_user } from '../middleware/auth_user';
import article_routes from './sub/article_routes';
import profile_routes from './sub/profile_routes';

const router = Router();

/** 
 * User routs for authentication
 *  - /api/user/register
 *  - /api/user/login
 *  - /api/user/logout
 * */ 
const userRoutes = Router();
userRoutes.post('/login', login_user);
userRoutes.post('/register', register_user);

const protected_routes = Router();
protected_routes.use(auth_user);


protected_routes.use('/articles', article_routes);
protected_routes.use('/stories', article_routes);
protected_routes.use('/profiles', profile_routes);


router.use('/user', userRoutes);
router.use('/', protected_routes);


export default router;