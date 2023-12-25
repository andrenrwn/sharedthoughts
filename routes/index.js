const router = require('express').Router();
const apiRoutes = require('./api');

// https://expressjs.com/en/api.html#req
// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function (req, res, next) {
    console.log('%s === ROUTE LOG === %s %s %s', new Date().toLocaleString(), req.method, req.url, req.path);
    // console.log('%s === user id: %s, logged in: %s, cookie: %s', new Date().toLocaleString(), req.session.user_id, req.session.logged_in, JSON.stringify(req.session.cookie));
    next();
});

router.use('/api', apiRoutes);

router.use((req, res) => res.send('/ - Nothing found here'));

module.exports = router;
