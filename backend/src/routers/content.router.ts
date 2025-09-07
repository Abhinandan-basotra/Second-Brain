import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { addContent, deleteContent, getSharedContent, getUserContent, shareLink } from '../controllers/content.controller';

const router = express.Router();

router.route('/content').post(isAuthenticated, addContent);
router.route('/content').get(isAuthenticated, getUserContent);
router.route('/content').delete(isAuthenticated, deleteContent);
router.route('/brain/share').post(isAuthenticated, shareLink);
router.route('/brain/:shareLink').get(isAuthenticated, getSharedContent)


export default router