const router = require('express').Router();

const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

router.use((req, res) => res.send('/api - No API route found for path'));

module.exports = router;
