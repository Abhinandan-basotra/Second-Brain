import express from 'express';
import {isAuthenticated} from '../middlewares/isAuthenticated';
import { login, signup } from '../controllers/user.controller';

const router = express.Router();

router.route('/signup').post(signup)
router.route('/login').post(login)

export default router