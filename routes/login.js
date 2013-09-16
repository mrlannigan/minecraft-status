
exports.index = function (req, res) {
  res.render('login', {message: req.flash('error')});
}