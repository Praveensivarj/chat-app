const { sequelize, User } = require('./dist/src/models');
const { hashPassword, randomNumber, generateRsaKeyPair, generateApiKey, generateSaltKey, generateEmailCodeExpiry } = require('./dist/src/utils/common.utils');

async function test() {
    try {
        const hashed = await hashPassword('JohnsDoe@123');
        const otp = randomNumber(6);
        const { publicKey, privateKey } = generateRsaKeyPair();
        const apiKey = generateApiKey();
        const saltKey = generateSaltKey();
        const permanentAccessToken = generateApiKey();

        console.log("Keys generated");

        const user = await User.create({
            unique_id: 'TEMP', email: 'johns.doe731' + Date.now() + '@gmail.com',
            passwordHash: hashed,
            email_otp: otp,
            email_otp_expiry: new Date(generateEmailCodeExpiry(15)),
            api_key: apiKey,
            salt_key: saltKey,
            access_token: permanentAccessToken,
            private_key: privateKey,
            publick_key: publicKey,
        });
        console.log("User created", user.unique_id);
    } catch (e) {
        console.error("ERROR:");
        console.error(e);
    }
    process.exit(0);
}
test();
