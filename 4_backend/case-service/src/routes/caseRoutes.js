const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { success, error } = require('../utils/responseHelper');
const { authMiddleware } = require('../utils/authMiddleware');
const caseService = require('../services/caseService');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/cases
router.get('/', asyncHandler(async (req, res) => {
  const result = await caseService.getCases(req.user.id, req.query);
  return success(res, 'Cases retrieved', result);
}));

// GET /api/cases/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const caseRecord = await caseService.getCase(req.user.id, req.params.id);
  if (!caseRecord) return error(res, 'Case not found', null, 404);
  return success(res, 'Case retrieved', { case: caseRecord });
}));

// POST /api/cases
router.post('/', asyncHandler(async (req, res) => {
  const newCase = await caseService.createCase(req.user.id, req.body);
  return success(res, 'Case created', { case: newCase }, 201);
}));

// POST /api/cases/sync
router.post('/sync', asyncHandler(async (req, res) => {
  const { cases } = req.body;
  if (!cases || !Array.isArray(cases)) return error(res, 'Invalid sync data', null, 400);
  const syncedCases = await caseService.syncCases(req.user.id, cases);
  return success(res, `${syncedCases.length} cases synced`, { cases: syncedCases }, 201);
}));

// PUT /api/cases/:id/notes
router.put('/:id/notes', asyncHandler(async (req, res) => {
  const { notes } = req.body;
  if (!notes) return error(res, 'Notes are required', null, 400);
  const updated = await caseService.addNotes(req.user.id, req.params.id, notes);
  if (!updated) return error(res, 'Case not found', null, 404);
  return success(res, 'Notes updated', { case: updated });
}));

// DELETE /api/cases/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await caseService.deleteCase(req.user.id, req.params.id);
  if (!deleted) return error(res, 'Case not found', null, 404);
  return success(res, 'Case deleted');
}));

module.exports = router;