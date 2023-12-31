const router = require('express').Router();
const {
  getThoughts,
  getOneThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers/thoughtsController');

// GET /api/users
// router.route('/').get(getThoughts);
router.get('/', getThoughts);

// GET /api/users/:id - get one user
router.get('/:id', getOneThought);

// POST /api/users - create one user
router.post('/', createThought);

// PUT /api/users/:id - update one user
router.put('/:id', updateThought);

// DELETE /api/users/:id - delete one user
router.delete('/:id', deleteThought);

// POST /api/thoughts/:thoughtId/reactions - add a reaction to a thought
router.post('/:thoughtId/reactions', addReaction);

// DELETE /api/thoughts/:thoughtId/reactions - add a reaction to a thought
router.delete('/:thoughtId/reactions/:reactionId', deleteReaction);

module.exports = router;
