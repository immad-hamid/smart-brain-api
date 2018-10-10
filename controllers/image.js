const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('*')
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
}

module.exports = { handleImage }