const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
app.get('/', (req, res) => {
    res.json('Success, but nothing at root');
})

// signin
app.post('/signin', (req, res) => {
    db.select('*')
        .from('login')
        .where('email', '=', req.body.email)
        .then(user => {
            const isValid = bcrypt.compareSync(req.body.password, user[0].hash);
            if (isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', user[0].email)
                    .then(userData => {
                        res.json(userData);
                    })
            } else res.status(400).json('Wrong Password, please try again')
        })
        .catch(error => {
            res.status(400).json('Unable to signin')
        });
})

// register
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email : loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0])
                })
                .catch(error => {
                    res.status(400).json('Unable to regiter');
                });
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(error => {
        res.status(400).json('Unable to regiter. Looks like the user already exist.')
    })
})

// get users
app.get('/profiles', (req, res) => {
    db.select('*')
        .from('users')
        .then(users => {
            res.json({
                meta: 'success',
                data: data = users
            })
        })
        .catch(error => {
            res.status(400).json('Sorry something went wrong')
        })
})

// get user
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db.select('*')
        .from('users').where({
            id: id
        })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('User does not exit')
            }
            
        })
        .catch(error => {
            res.status(400).json('Unable to get users')
        });
})

// post image entries
app.put('/image', (req, res) => {
    const { id } = req.body;
    
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            if (entries.length) {
                res.json(entries[0]);
            } else {
                res.status(400).json('User with this id does not exist')
            }
        })
        .catch(error => {
            res.status(400).json('Unable to update the user entries')
        })
})

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