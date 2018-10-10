const handleSignin = (db, bcrypt) => (req, res) => {
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
                        res.json({
                            meta: 'success',
                            data: userData
                        })
                    })
            } else res.status(400).json('Wrong Password, please try again')
        })
        .catch(error => {
            res.status(400).json('Unable to signin')
        });
}

module.exports = { handleSignin }