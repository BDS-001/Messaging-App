const { matchedData } = require('express-validator');
const {getUserForAuth} = require('../prisma/queries/userQueries')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

function getCurrentUser(req, res) {
    return res.status(200).json({
        message: 'Current user retrieved successfully',
        data: req.user
    });
}

async function login(req, res, next) {
    try {
        const {email, password} = matchedData(req, { locations: ['body'] });
        const user = await getUserForAuth(email)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '7d',
                algorithm: 'HS256'
            }
        );

        const { password: _, ...userWithoutPassword } = user;
        return res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'An error occurred while authenticating the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error)
    }
}

module.exports = {getCurrentUser, login}