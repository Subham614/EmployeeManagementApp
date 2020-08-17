const jwt = require('jsonwebtoken');
const Employee = require('../model/Employee');


 function authenticateToken(req, res, next) { // input should be Bearer [token]
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) 
  return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, 'secret_string', async (err, user) => {
    if (err) return res.sendStatus(403)
	let doc = await Employee.findOne({empid:user.empid});
	if(doc){
		next()
	}
  })

 }


module.exports = {
	authenticateToken
}