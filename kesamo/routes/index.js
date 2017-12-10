var express = require('express');
var router = express.Router();

router.get('/images/icon/:file', function(req, res, next) {
  var file = req.params.file
  res.sendFile('/images/icon/' + file);
});

router.get('/*', function(req, res, next) {
  res.render('index');
});

module.exports = router;
