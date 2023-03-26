const AuthAccessTokens = require('../models/auth-access-tokens');

module.exports = class TokenController {
  static async allowSignIn(userId, clientId) {
    // console.log(userId, '**', clientId);
    let result = await AuthAccessTokens.findOne({
      userId: userId,
      clientId: clientId,
      revoked: false,
      expiresIn: { $gte: Date.now() },
    });
    return result == null;
  }

  static async revokePreviousToken(userId) {
    await AuthAccessTokens.updateMany(
      { userId: userId, expiresIn: { $gte: Date.now() } },
      { $set: { revoked: true } }
    );
  }

  static async saveNewToken(userId, clientId, expiresIn) {
    let result = await AuthAccessTokens.insertMany({
      userId: userId,
      clientId: clientId,
      expiresIn: expiresIn,
    });
    return result[0];
  }

  static async getAccessToken(tokenId) {
    return await AuthAccessTokens.findById(tokenId);
  }
};