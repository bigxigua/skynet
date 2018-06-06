var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var proxy = require('http-proxy-middleware');

var indexRouter = require('./routes/index');


var isProduction = !!process.env.NODE_ENV;

var app = express();

app.use('/v1/match/*',proxy({
  target: 'http://platform.api.loongcent.com.cn' + (isProduction ? '' : ':8000'),
  changeOrigin:true
}));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public/dist')));
app.use('/login',express.static(path.join(__dirname, 'public/dist')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use('/', indexRouter);


app.get('/health', function(req, res) {
  res.send('ok');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err, '---------------------------------------');
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
