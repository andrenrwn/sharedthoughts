const router = require('express').Router();
const {
  getUsers,
  getOneUser,
} = require('../../controllers/usersController');

// /api/users
// router.route('/').get(getUsers);
router.get('/', getUsers);

// /api/users/:id - get one user
router.get('/:id', getOneUser);

// // /api/students
// router.route('/').get(getStudents).post(createStudent);

// // /api/students/:studentId
// router.route('/:studentId').get(getSingleStudent).delete(deleteStudent);

// // /api/students/:studentId/assignments
// router.route('/:studentId/assignments').post(addAssignment);

// // /api/students/:studentId/assignments/:assignmentId
// router.route('/:studentId/assignments/:assignmentId').delete(removeAssignment);

module.exports = router;
