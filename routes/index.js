
var exec = require('child_process').exec,
  child;

exports.index = function(req, res){
  if (req.user === undefined) {
    return res.redirect('/login');
  }

  child = exec('/etc/init.d/minecraft status',
    function (error, stdout, stderr) {
      if (error !== null) {
        res.locals.status_output = error.toString();
      } else {
        res.locals.status_output = stdout.toString();
      }
      res.render('index');
  });

};
