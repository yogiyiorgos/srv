const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises
const path = require('path')

const handleLogout = async (req, res) => {
    // On client also delete the accessToken in the memory of the client app

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    const refreshToken = cookies.jwt

    // Is refreshToken in DB?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: none })
        return res.sendStatus(204) // No content
    }

    // Delete the refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToke !== foundUser.refreshToken)
    const currentUser = { ...foundUser, refreshToken: '' }
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })  // In production we add 'secure: true'
    res.sendStatus(204)

}


module.exports = { handleLogout }