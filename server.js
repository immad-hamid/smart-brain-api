const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profiles = require('./controllers/profiles');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database : 'smart-brain'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

// root
app.get('/', (req, res) => { res.json('Success, but nothing at root') })

// register
app.post('/register', register.handleRegister(db, bcrypt))
// signin
app.post('/signin', signin.handleSignin(db, bcrypt))
// get users
app.get('/profiles', profiles.handleProfiles(db))
// get user
app.get('/profile/:id', profile.handleProfile(db))
// post image entries
app.put('/image', image.handleImage(db))

// serving our applicaiton
app.listen(3000, () => {
    console.log('server is working at port 3000');
});


/*
/                   ==>     res     =   this is working
/signin             ==>     POST    =   success/fail
/register           ==>     POST    =   user
/profiles           ==>     GET     =   user
/profile/:userId    ==>     GET     =   user
/image              ==>     PUT     =   user
*/