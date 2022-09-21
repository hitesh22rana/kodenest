const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/userDto');

class AuthController {
    async sendOtp(req, res) {
        // Logic
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email field is required!" });
        }

        const user = await userService.findUser({ email });

        if (user) {
            return res.status(400).json({ message: "User is already registered!" });
        }

        const otp = await otpService.generateOtp();

        // Hash
        const expireTime = 1000 * 60 * 2;
        const expires = Date.now() + expireTime;
        const data = `${email}.${otp}.${expires}`;

        const hash = hashService.hashOtp(data);

        // Send OTP
        try {
            otpService.sendByEmail(email, otp);
            return res.status(200).json({
                hash: `${hash}.${expires}`,
                email,
                otp,
            });
        } catch (err) {
            return res.status(500).json({ message: "Message sending failed!" });
        }
    }

    async verifyOtp(req, res) {
        // Logic
        const { otp, hash, email, password } = req.body;
        if (!otp || !hash || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            return res.status(400).json({ message: "OTP Expired!" });
        }

        const data = `${email}.${otp}.${expires}`;

        const isValid = otpService.verifyOtp(hashedOtp, data);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid OTP!" });
        }

        let user;

        try {
            user = await userService.findUser({ email });
            if (!user) {
                user = await userService.createUser({ email, password });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'DataBase error!' });
        }

        // JWT Token
        const { accessToken, refreshToken } = tokenService.generateTokens({
            _id: user._id,
            activated: false
        });

        await tokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        const userDto = new UserDto(user);
        return res.status(201).json({ user: userDto, auth: true });
    }

    async refresh(req, res) {
        const { refreshToken: refreshTokenFromCookie } = req.cookies;

        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        try {
            const token = await tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );
            if (!token) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }

        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: 'No user' });
        }

        const { refreshToken, accessToken } = tokenService.generateTokens({
            _id: userData._id,
        });


        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (err) {
            return res.status(500).json({ message: 'Internal Server error!' });
        }

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        const userDto = new UserDto(user);
        return res.json({ user: userDto, auth: true });
    }

    async login(req, res) {
        const { email, password, toRemember } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        let user;

        try {
            user = await userService.findUser({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid Credentials!' });
            }

            const isUser = await hashService.comparePassword(password, user?.password)

            if (!(isUser)) {
                return res.status(400).json({ message: 'Invalid Credentials!' });
            }

            if (!user?.activated) {
                const { accessToken, refreshToken } = tokenService.generateTokens({
                    _id: user._id,
                    activated: false
                });

                if (toRemember) {
                    await tokenService.storeRefreshToken(refreshToken, user._id);

                    res.cookie('refreshToken', refreshToken, {
                        maxAge: 1000 * 60 * 60 * 24 * 30,
                        httpOnly: true,
                    });
                }

                res.cookie('accessToken', accessToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    httpOnly: true,
                });

                const userDto = new UserDto(user);
                return res.status(201).json({ user: userDto, auth: true });
            } else {
                const { accessToken, refreshToken } = tokenService.generateTokens({
                    _id: user._id,
                    activated: true
                });

                if (toRemember) {
                    await tokenService.storeRefreshToken(refreshToken, user._id);

                    res.cookie('refreshToken', refreshToken, {
                        maxAge: 1000 * 60 * 60 * 24 * 30,
                        httpOnly: true,
                    });
                }

                res.cookie('accessToken', accessToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    httpOnly: true,
                });

                const userDto = new UserDto(user);
                return res.status(201).json({ user: userDto, auth: true });
            }


        } catch (err) {
            return res.status(400).json({ message: 'User is not registered!' });
        }
    }

    async logout(req, res) {
        const { refreshToken } = req.cookies;

        await tokenService.removeToken(refreshToken);

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return res.json({ user: null, auth: false });
    }

    async forgotPassword(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Invalid Credentials!' });
        }

        let user;

        try {
            user = await userService.findUser({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid Credentials!' });
            }

            let token;
            try {
                token = tokenService.generateResetPasswordToken(user._id);
            } catch (err) {
                return res.status(500).json({ message: "Internal Server Error!" })
            }

            const link = `${process.env.FRONT_URL}/login/reset/${token}`;

            // Send OTP
            const status = await userService.findAndUpdateUser({ email: user.email }, { resetLink: token });
            if (!status) return res.status(400).json({ message: "Reset password link error!" });

            otpService.sendResetPasswordByEmail(email, link);
            return res.status(200).json({ message: "Activation Link sent!" });
        } catch (err) {
            return res.status(400).json({ message: 'User is not registered!' });
        }
    }

    async resetPassword(req, res) {
        // Verify JWT Token
        const { token } = req.params;
        if (!token) return res.status(400).json({ message: 'Invalid Token!' });

        try {
            tokenService.verifyResetPasswordToken(token);
        } catch (err) {
            if (err.message.toString().includes("malformed")) return res.status(400).json({ message: 'Invalid Token!' });
            return res.status(400).json({ message: 'Session has been Exppired!' });
        }

        // User
        let user;

        try {
            user = await userService.findUser({ resetLink: token });
            if (!user) {
                return res.status(400).json({ message: 'Invalid Credentials!' });
            }
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error!" });
        }

        // New Password
        const { password } = req.body;
        const hashedPassword = await hashService.hashPassword(password);

        try {
            const status = await userService.findAndUpdateUser({ email: user?.email }, { password: hashedPassword, resetLink: "" });
            if (!status) return res.status(400).json({ message: "Reset password link error!" });
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error!" });
        }

        return res.status(200).json({ message: 'Password has been Reset!' });
    }

    async verifyTokenLink(req, res) {
        const token = req.params.token;

        if (!token) return res.status(400).json({ message: 'Invalid Token!' });

        try {
            tokenService.verifyResetPasswordToken(token);
        } catch (err) {
            if (err.message.toString().includes("malformed")) return res.status(400).json({ message: 'Invalid Token!' });
            return res.status(400).json({ message: 'Session has been Exppired!' });
        }

        let user;

        try {
            user = await userService.findUser({ resetLink: token });

            if (!user) {
                return res.status(400).json({ message: 'Invalid Credentials!' });
            } else {
                return res.status(200).json({ message: 'Reset your password now!' });
            }

        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    }

}

module.exports = new AuthController();