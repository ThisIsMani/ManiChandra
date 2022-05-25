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


const PORT = 3001;


let myStrings = ["bonfire", "cardio", "case", "character", "bonsai", "pear", "plum", "strawberry", "watermelon", "grape", "cherry", "mango", "pineapple", "peach", "coconut", "papaya", "avocado", "lemon", "lime", "cucumber", "tomato"];

app.get('/prefixes', async (req, res) => {
    let keyWords;
    myStrings = myStrings.sort();
    keyWords = req.query.keywords.split(',');

    let result = [];
    for (let word of keyWords) {
        if (myStrings.includes(word)) {
            let currentIndex = myStrings.indexOf(word);
            let nextIndex = currentIndex + 1;
            let previousIndex = currentIndex - 1;
            let prefixIndex = 0;
            let isPrefixIndexChanged = false;
            for (let i = 0; i < word.length; i++) {
                isPrefixIndexChanged = true;
                if ((nextIndex < myStrings.length && myStrings[nextIndex][i] === word[i]) || (previousIndex >= 0 && myStrings[previousIndex][i] === word[i])) {
                    prefixIndex++;
                    isPrefixIndexChanged = false;
                }
                if (isPrefixIndexChanged) break;
            }
            let obj = {
                keyword: word,
                status: "found",
                prefix: word.slice(0, prefixIndex + 1)
            }
            result.push(obj);
        } else {
            let obj = {
                keyword: word,
                status: "not found",
                prefix: "not_applicable"
            }
            result.push(obj);
        }
    }
    res.send(result);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

module.exports = app;
