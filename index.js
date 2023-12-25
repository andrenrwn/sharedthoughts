const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const cwd = process.cwd();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Express JSON parser error handler to catch errors, ie. when req.body isn't a proper JSON format
// From https://stackoverflow.com/questions/58134287/catch-error-for-bad-json-format-thrown-by-express-json-middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error(err);
      return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
