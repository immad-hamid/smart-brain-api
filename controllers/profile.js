const handleProfile = (db) => (req, res) => {
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
}

module.exports = { handleProfile }