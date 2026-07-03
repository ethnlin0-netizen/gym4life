import jwt from 'jsonwebtoken'
const authMiddleware = (req, res, next) => {
    //grab the token from request headers
    const token = req.headers.authorization?.split(' ')[1];
    //the '?' makes it so if the token exists, split it and if it doesn't, just return undefined

    //check if the token exists
    if(!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    //verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //if token is valid, it returns the payload, which is the user id in this case
        req.user = decoded;
        next(); //pass request on to route handler
    } catch(error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default authMiddleware