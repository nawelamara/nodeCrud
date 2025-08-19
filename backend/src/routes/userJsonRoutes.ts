import express from 'express';

import {
  createUserJson,
  getUsersJson,
  getUserJson,
  updateUserJson,
  deleteUserJson,
} from '../controllers/userControllerJson';

const router = express.Router();

router.post('/', createUserJson);
router.get('/', getUsersJson);
router.get('/:id', getUserJson);
router.put('/:id', updateUserJson);
router.delete('/:id', deleteUserJson);

export default router;
