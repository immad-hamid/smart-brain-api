const handleRegister = (db, bcrypt) => (req, res) => {
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
                    res.json({
                        meta: 'success',
                        data: user[0]
                    })
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
}

module.exports = { handleRegister }