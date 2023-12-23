// const express = require('express');
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


//-=========================

// const path = require('path');
// const express = require('express');
// const session = require('express-session');
// const exphbs = require('express-handlebars');
// const routes = require('./controllers');
// const helpers = require('./utils/helpers');

// const sequelize = require('./config/connection');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Set up Handlebars.js engine with custom helpers
// const hbs = exphbs.create({ helpers });

// const sess = {
//   secret: "This is not a secret, it's just a seed",
//   cookie: {
//     maxAge: 3600000, // 1 hour instead of 5 min for development
//     httpOnly: true,
//     secure: false,
//     sameSite: 'strict',
//   },
//   resave: false,
//   saveUninitialized: true,
//   store: new SequelizeStore({
//     db: sequelize
//   })
// };

// app.use(session(sess));

// // Inform Express.js on which template engine to use
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(routes);

// sequelize.sync({ force: false }).then(() => {
//   app.listen(PORT, () => console.log('Now listening'));
// });
