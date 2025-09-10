import express from 'express';
import {isAuthenticated} from '../middlewares/isAuthenticated';
import { getProfile, login, logOut, signup } from '../controllers/user.controller';

const router = express.Router();

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logOut').get(logOut)
router.route('/getProfile').get(isAuthenticated, getProfile)

export default router