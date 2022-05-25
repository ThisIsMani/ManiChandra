var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


const PORT = 3000;

// Main Code HERE
app.get('/numbers', async (req, res) => {
    // could have used a priority queue here but javascript doesn't natively support it
    let numbers = new Set();
    let isSent = false;
    setTimeout(() => {
        if (!isSent) {
            isSent = true;
            numbers = [...numbers].sort((a, b) => a - b);
            res.send({"numbers" : numbers});
        }
    }, 492 /*8ms for sorting(i guess)*/);


    let urlList;
    if (typeof req.query.url === 'string') {
        urlList = [req.query.url];
    } else {
        urlList = req.query.url
    }


    urlList = urlList.filter(url => {
        try {
            new URL(url);
        } catch (_) {
            return false;
        }
        return true;
    });

    for (let url of urlList) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            data.numbers.forEach(number => {
                numbers.add(number);
            });
        } catch (e) {
        }
    }

    numbers = [...numbers].sort((a, b) => a - b);
    if (!isSent) {
        isSent = true;
        res.send({"numbers" : numbers});
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

module.exports = app;
