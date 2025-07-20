import express from 'express';

import {
  createFlag,
  getAllFlags,
  evaluateFlag,
  toggleFlag,
  deleteFlag,
  bulkUpdateFlags,
  initializeDefaultFlags
} from '../controllers/flag.controller';

const router = express.Router();

router.post('/', createFlag);                    // Create new flag
router.get('/', getAllFlags);                    // Get all flags
router.get('/:name', evaluateFlag);              // Evaluate flag by name
router.put('/:id', toggleFlag);                  // Toggle flag status
router.delete('/:id', deleteFlag);               // Delete flag
router.put('/bulk/update', bulkUpdateFlags);     // Bulk update flags
router.post('/initialize', initializeDefaultFlags); // Initialize default flags

export default router;

