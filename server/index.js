const express = require('express');
const chalk = require('chalk');
const path = require('path');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const {
  db,
  models,
} = require('./db/index.js');

const { User } = models; 

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(chalk.cyan(`${req.method} ${req.path}`));
  next();
});

app.use((req, res, next) => {
  // console.log(req.cookies.uuid)
  User.findByPk(req.cookies.uuid)
    .then(userOrNull => {
      if (userOrNull) {
        req.loggedIn = true;
        req.user = userOrNull;
      }
      else {
        req.loggedIn = false;
      }
      next()
    })
    .catch(e => {
      console.error(e)
      next()
    })
})

app.use(express.static(path.join(__dirname, '../dist')));

app.post('/login', (req, res, next) => {
  const { userName, password } = req.body
  User.findOne({
    where: {
      userName,
      password,
    }
  })
    .then((userOrNull) => {
      if (userOrNull) {
        res.cookie('uuid', userOrNull.id, {
          path: '/',
          expires: moment.utc().add(1, 'day').toDate(),
        })
        return res.status(202).send('success!')
      }
      res.status(401).send('failure');
    })
    .catch(e => {
      console.error(e);
      res.status(500).send('internal error');
      next(e);
    })
})

app.get('/logout', (req, res, next) => {
  res.clearCookie('uuid');
  res.send('cookie cleared!')
})

app.get('/whoami', (req, res, next) => {
  console.log(req.loggedIn)
  if (req.loggedIn) {
    res.send(req.user)
  }
  else {
    res.status(401).send('no prior login!')
  }
})

db.sync({ force: true })
  .then(() => {
    User.create({
      userName: 'testyTest',
      password: 'abcde'
    })
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(chalk.greenBright(`Server is listening on http://localhost:${PORT}`));
    });
  })
  .catch(e => {
    console.error(e);
  });
