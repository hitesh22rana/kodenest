const crypto = require('crypto');
const bcrypt = require('bcrypt');

class HashService {
    hashOtp(data) {
        return crypto.createHmac('sha256', process.env.HASH_SECRET).update(data).digest('hex');
    }

    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = new HashService();