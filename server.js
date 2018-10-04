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
      password : 'hello',
      database : 'smart-brain'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

// database
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

// root
app.get('/', (req, res) => {
    res.send(database.users);
})

// signin
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) 
    {
        res.json('Signin is working');
    } else {
        res.status(400).json('Error Loggin in');
    }
})

// register
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
        .returning('*')
        .insert({
            email : email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            res.status(400).json('Unable to regiter');
        });
})

// get user
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found) 
        res.status(404).json('User not Found!!!')
})

// post image entries
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) 
        res.status(404).json('User not Found!!!')
})

// serving our applicaiton
app.listen(3000, () => {
    console.log('server is working at port 3000');
});


/*
/                   ==>     res     =   this is working
/signin             ==>     POST    =   success/fail
/register           ==>     POST    =   user
/profile/:userId    ==>     GET     =   user
/image              ==>     PUT     =   user
*/