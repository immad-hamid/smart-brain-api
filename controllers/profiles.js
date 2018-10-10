const handleProfiles = (db) => (req, res) => {
    db.select('*')
        .from('users')
        .then(users => {
            res.json({
                meta: 'success',
                data: users
            })
        })
        .catch(error => {
            res.status(400).json('Sorry something went wrong')
        })
}

module.exports = { handleProfiles }