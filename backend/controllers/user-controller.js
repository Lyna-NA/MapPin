const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'outlook',
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.index = async (req, res) => {
  let response = await User.find();
  res.status(200).json({ status: true, data: response });
};

exports.show = async (req, res) => {
  try {
    let response = await User.findById(req.params.id);
    return res.status(200).json({ status: true, data: response });
  } catch (error) {
    return res
      .status(404)
      .json({ status: false, message: 'Document not found!' });
    // throw new HttpError(404, 'Document Not Found!');
  }
};

exports.store = async (req, res) => {
  try {
    //1000-9999 || 0000<=>9999
    let randomNumber = Math.random() * 10000;
    let verification_code = Math.round(randomNumber);

    let hashedPassword = await bcrypt.hash(req.body.password, 12);
    let hashedVerificationCode = await bcrypt.hash(verification_code.toString(), 12);

    let result = await User.insertMany({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      verification_code: hashedVerificationCode,
    });

    // send verification email via Nodemailer  => it works!
    // await transporter.sendMail({
    //   from: '"Travel Map Pin App" lnafar@iugaza.edu.ps',
    //   to: req.body.email,
    //   subject: 'Verify Your Email',
    //   text: `Your verification code is ${verification_code}`,
    //   html: `Your verification code is <b>${verification_code}</b>`,
    // }).then(d=>console.log(d)).catch(e=>console.log(e));
    
    res.status(201).json({
      status: true,
      message: 'User Registered Successfully!',
      // data: result,
      verification_code: verification_code,
    });
  } catch (error) {
    console.log('Error!: ', error);

    res.status(400).json({
      status: false,
      message: 'Failed to Register!',
    });
  }
};

exports.update = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
        },
      }
    );
    res.status(204).json({ status: true, message: 'Success' });
  } catch (error) {
    res.status(422).json({
      status: false,
      message: 'Failed, Document not found',
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    let result = await User.deleteOne({ _id: req.params.id });
    let isDeleted = result.deletedCount == 1;
    res.status(isDeleted ? 204 : 404).json({
      status: isDeleted,
      message: isDeleted ? 'Success' : 'Not found',
      result: result,
    });
  } catch (error) {
    res.status(422).json({
      status: false,
      message: 'Failed, Document not found',
    });
  }
};