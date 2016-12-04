const
	express = require('express'),
	router = express.Router()

router.use('/comments', require('./comments'));
router.use('/users', require('./users'));
router.use('/upload', require('./upload'));

router.get('/', function(req, res) {
  res.render('index')
})

module.exports = router