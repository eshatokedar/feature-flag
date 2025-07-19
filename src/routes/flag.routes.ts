import express from 'express';
import { createFlag, getAllFlags } from '../controllers/flag.controller';
import { evaluateFlag } from '../controllers/flag.controller';

const router = express.Router();

router.post('/', createFlag);
router.get('/', getAllFlags);
router.get('/:name', evaluateFlag);


export default router;
