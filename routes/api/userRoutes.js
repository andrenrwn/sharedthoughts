const router = require('express').Router();
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/usersController');

// GET /api/users
// router.route('/').get(getUsers);
router.get('/', getUsers);

// GET /api/users/:id - get one user
router.get('/:id', getOneUser);

// POST /api/users - create one user
router.post('/', createUser);

// PUT /api/users/:id - update one user
router.put('/:id', updateUser);

// DELETE /api/users/:id - delete one user
router.delete('/:id', deleteUser);

// Manage a user's friends
// POST /api/users/:id/friends/:friendid - add a friend to user :id
router.post('/:id/friends/:friendId', addFriend);

// DELETE /api/users/:id/friends/:friendid - add a friend to user :id
router.delete('/:id/friends/:friendId', deleteFriend);


module.exports = router;
