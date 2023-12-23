const router = require('express').Router();
// const courseRoutes = require('./courseRoutes');
// const studentRoutes = require('./studentRoutes');

// router.use('/courses', courseRoutes);
// router.use('/students', studentRoutes);

const userRoutes = require('./userRoutes');

router.use('/users', userRoutes);

router.use((req, res) => res.send('/api - No API route found for path'));


module.exports = router;
