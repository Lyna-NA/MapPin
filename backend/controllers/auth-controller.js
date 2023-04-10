const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthClients = require('../models/auth-clients');
const TokenController = require('./token-controller');
const { addDays } = require('../utils/date-utils');

exports.login = async (req, res) => {

  try {
  // Get user by unique login entity (ex: email)
    const user = await User.findOne({ email: req.body.email });
    
    if (user != null) {
    // If exists, compare hashes (The original hashed password in document with the sent password in request)
      const correctPassword = bcrypt.compare(
        req.body.password,
        user.password
      );

      if (correctPassword) {
        // if (user.verified) {
          // const client = await AuthClients.findOne({ provider: 'users' });

          //check if a token is currently active
          // const isAllowed = await TokenController.allowSignIn(user.id, client.id);

          // if (isAllowed) {
            const expiryDate = addDays(30);

            // const newToken = await TokenController.saveNewToken(
            //   user.id,
            //   client.id,
            //   expiryDate
            // );

            const token = jwt.sign(
              { id: user._id
                // ,tokenId: newToken.id 
                },
              process.env.secret_key,
              {
                expiresIn: expiryDate,
              }
            );

            user['_doc'].token = token;

            // const data = { ...user._doc, token };
            return res.status(200).json({
              status: true,
              message: 'Logged in successfully',
              user: user,
            });
          // }
          // return res.status(401).json({
          //   status: false,
          //   message: 'Login rejected due to an existing login session',
          // });
        // }
        // return res.status(400).json({
        //   status: false,
        //   message: 'Account is not verified, verify to login',
        // });
      }
      return res.status(400).json({
        status: false,
        message: 'Error credentials, check email or password',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'No account attached to this email',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.multiLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user != null) {
      const correctPassword = bcrypt.compare(
        req.body.password,
        user.password
      );
      if (correctPassword) {
        if (user.verified) {
          //Second Scenario:
          const client = await AuthClients.findOne({ provider: 'users' });

          const expiryDate = addDays(30);

          const newToken = await TokenController.saveNewToken(
            user.id,
            client.id,
            expiryDate
          );
          // console.log('New Token: ', newToken.id);

          const token = jwt.sign(
            { id: user._id, tokenId: newToken.id },
            process.env.secret_key,
            {
              expiresIn: expiryDate,
            }
          );

          user['_doc'].token = token;

          // const data = { ...user._doc, token };
          return res.status(200).json({
            status: true,
            message: 'Logged in successfully',
            user: user,
          });
        }
        return res.status(400).json({
          status: false,
          message: 'Account is not verified, verify to login',
        });
      }
      return res.status(400).json({
        status: false,
        message: 'Error credentials, check email or password',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'No account attached to this email',
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.loginWithPreviousRevoke = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user != null) {
      const correctPassword = bcrypt.compare(
        req.body.password,
        user.password
      );
      if (correctPassword) {
        if (user.verified) {
          //Third Scenario:
          await TokenController.revokePreviousToken(user.id);

          const client = await AuthClients.findOne({ provider: 'users' });

          const expiryDate = addDays(30);

          const newToken = await TokenController.saveNewToken(
            user.id,
            client.id,
            expiryDate
          );
          // console.log('New Token: ', newToken.id);

          const token = jwt.sign(
            { id: user._id, tokenId: newToken.id },
            process.env.secret_key,
            {
              expiresIn: expiryDate,
            }
          );

          user['_doc'].token = token;

          // const data = { ...user._doc, token };
          return res.status(200).json({
            status: true,
            message: 'Logged in successfully',
            user: user,
          });
        }
        return res.status(400).json({
          status: false,
          message: 'Account is not verified, verify to login',
        });
      }
      return res.status(400).json({
        status: false,
        message: 'Error credentials, check email or password',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'No account attached to this email',
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.signout = async (req, res) => {
  TokenController.revokePreviousToken(req.userId);
  res.status(200).json({ status: true });
};

exports.verify = async (req, res) => {

  const email = req.body.email;
  const code = req.body.code;

  const user = await User.findOne({ email: email });

  console.log("user: ", user);

  if (user != null) {
    if (user.verification_code != null) {
      const isCorrectCode = await bcrypt.compare(code, user.verification_code);
      if (isCorrectCode) {
        user.verified = true;
        user.verification_code = null;
        const updatedResult = await User.updateOne(
          { _id: user._id },
          { $set: user }
        );
        const isUpdated = updatedResult.modifiedCount == 1;
        return res.status(isUpdated ? 200 : 400).json({
          status: isUpdated,
          message: isUpdated
            ? 'Account verified successfully'
            : 'Process failed, try again',
        });
      }
      return res.status(400).json({
        status: false,
        message: 'Incorrect verification code',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'No verification code to be verified, process rejected',
    });
  }
  return res.status(400).json({
    status: false,
    message: 'Process rejected',
  });
};

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  
  if (user != null) {
    if (user.reset_code == null) {
      const resetCode = Math.round(Math.random() * 10000);
      const hashedResetCode = await bcrypt.hash(resetCode.toString(), 12);

      user.reset_code = hashedResetCode;
      const updateResult = await User.updateOne(
        { _id: user.id },
        { $set: user }
      );
      const updated = updateResult.modifiedCount == 1;
      return res.status(updated ? 200 : 400).json({
        status: updated,
        message: updated
          ? 'Reset code sent successfully'
          : 'Reset process failed, try again.',
        code: resetCode,
      });
    }
    return res.status(400).json({
      status: false,
      message: 'Password reset code requested before, check email',
    });
  }
  return res
    .status(400)
    .json({ status: false, message: 'Email is not registered in our records' });
};

exports.resetPassword = async (req, res) => {

  const email = req.body.email;
  const user = await User.findOne({ email: email });

  if (user != null) {
    if (user.reset_code != null) {
      const isCorrectCode = await bcrypt.compare(req.body.code, user.reset_code);
      if (isCorrectCode) {
        user.reset_code = null;
        user.password = await bcrypt.hash(req.body.password, 12);
        const updateResult = await User.updateOne(
          { _id: user._id },
          { $set: user }
        );
        const updated = updateResult.modifiedCount == 1;
        return res.status(updated ? 200 : 400).json({
          status: updated,
          message: updated
            ? 'Password reset successfully'
            : 'Failed to reset password',
        });
      }
      return res.status(400).json({
        status: false,
        message: 'Reset code is not correct',
      });
    }
    return res.status(400).json({
      status: false,
      message: 'Process rejected, no reset request',
    });
  }
  return res.status(400).json({
    status: false,
    message: 'Email is not registered in our records',
  });
};

exports.info = async (req, res) => {
  const user = await User.findById(req.userId);
  return res
    .status(200)
    .json({ message: 'Authorized/Authenticated', user: user });
};

exports.addClients = async (req, res) => {
  /**
   * 1) Hashed ClientId
   * 2) Hashed Secret Key
   */

  const result = await AuthClients.insertMany([
    {
      name: 'user-client',
      secret: '-',
      provider: 'users',
      revoked: false,
    },
  ]);

  if (result.length != 0) {
    const secret = bcrypt.hashSync(result[0].id, 12);
    await AuthClients.updateOne(
      { _id: result[0].id },
      { $set: { secret: secret } }
    );
  }

  return res.status(200).json({ status: true });
};