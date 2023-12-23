const router = require('express').Router();
const {
  getUsers,
  getOneUser,
  createUser,
  deleteUser,
} = require('../../controllers/usersController');

// GET /api/users
// router.route('/').get(getUsers);
router.get('/', getUsers);

// GET /api/users/:id - get one user
router.get('/:id', getOneUser);

// POST /api/users - create one user
router.post('/', createUser);

// DELETE /api/users/:id - delete one user
router.delete('/:id', deleteUser);

// // /api/students
// router.route('/').get(getStudents).post(createStudent);

// // /api/students/:studentId
// router.route('/:studentId').get(getSingleStudent).delete(deleteStudent);

// // /api/students/:studentId/assignments
// router.route('/:studentId/assignments').post(addAssignment);

// // /api/students/:studentId/assignments/:assignmentId
// router.route('/:studentId/assignments/:assignmentId').delete(removeAssignment);

module.exports = router;
