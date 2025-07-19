import express from 'express';

import {
  createFlag,
  getAllFlags,
  evaluateFlag,
  toggleFlag,
  deleteFlag
} from '../controllers/flag.controller';

const router = express.Router();

router.post('/', createFlag);        // Create new flag
router.get('/', getAllFlags);        // Get all flags
router.get('/:name', evaluateFlag);  // Evaluate flag by name
router.put('/:id', toggleFlag);      // ✅ Toggle flag status (new)
router.delete('/:id', deleteFlag);   // ✅ Delete flag (new)

export default router;

