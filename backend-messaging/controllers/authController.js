const { matchedData } = require('express-validator');
const { getUserForAuth } = require('../prisma/queries/userQueries');
const userQueries = require('../prisma/queries/userQueries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpStatusCodes = require('../utils/httpStatusCodes');

function getCurrentUser(req, res) {
    return res.status(httpStatusCodes.OK).json({
        success: true,
        message: 'Current user retrieved successfully',
        data: req.user
    });
}

async function login(req, res) {
    try {
        const { email, password } = matchedData(req, { locations: ['body'] });
        const user = await getUserForAuth(email);

        if (!user) {
            return res.status(httpStatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(httpStatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '7d',
                algorithm: 'HS256'
            }
        );

        const { password: _, ...userWithoutPassword } = user;
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        console.log(error);
        console.log(error);
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while authenticating the user',
        });
    }
}

async function resetUserPassword(req, res) {
    try {
        const { currentPassword, newPassword } = matchedData(req, { locations: ['body'] });
        const userToken = req.user
        const user = await getUserForAuth(userToken.email);

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);

        if (!isValidPassword) {
            return res.status(httpStatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await userQueries.updateUser(userToken.id, {password: hashedNewPassword})

        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Password update successful',
        });

    } catch (error) {
        console.log(error);
        console.log(error);
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while authenticating the user',
        });
    }
}

module.exports = { getCurrentUser, login, resetUserPassword };