const routes = require('express').Router();
const presentation = require('./presentation');

routes.use('/presentation', presentation);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;
