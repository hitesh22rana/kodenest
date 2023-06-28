const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN;
const resetPasswordTokenSecret = process.env.JWT_RESET_PASSWORD_TOKEN;
const refreshModel = require('../models/refreshToken');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1m',
        });

        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y',
        });

        return { accessToken, refreshToken };
    }

    async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({
                token,
                userId,
            });
        } catch (err) {
            console.log(err.message);
        }
    }

    verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret);
    }

    verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshModel.findOne({
            userId: userId,
            token: refreshToken,
        });
    }

    async updateRefreshToken(userId, refreshToken) {
        return await refreshModel.updateOne(
            { userId: userId },
            { token: refreshToken }
        );
    }

    async removeToken(refreshToken) {
        return await refreshModel.deleteOne({ token: refreshToken });
    }

    generateResetPasswordToken(id) {
        return jwt.sign({ id }, resetPasswordTokenSecret, { expiresIn: '30m' })
    }

    verifyResetPasswordToken(token) {
        return jwt.verify(token, resetPasswordTokenSecret);
    }
}

module.exports = new TokenService()