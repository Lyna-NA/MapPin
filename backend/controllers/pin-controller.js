const Pin = require('../models/Pin');
// const socket = require('../utils/socket-io');

exports.index = async (req, res) => {
  try {
  let pins = await Pin.find();
  res.status(200).json({ status: true, message: 'Success', data: pins });

  } catch (error) {
    res.status(400).json({ status: false, message: 'Failed to get pins', data: null });
  }
};

exports.show = async (req, res) => {
  //
};

exports.store = async (req, res) => {
  const newPin = new Pin(req.body);

  try {
    const savedPin = await newPin.save();
    res.status(201).json({
      status: true,
      message: 'Pin created successfully',
      data: savedPin,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: 'Failed to create pin', data: null });
  }  

  // //TODO: Execute socket.io
  // // socket.getIO().on('pins', (data) => {
  // //   console.log('Event: Pins');
  // //   console.log('data: ', data);
  // // })

  // let status = socket
  //   .getIO()
  //   .emit('pins', { action: 'store', pin: result[0] });
};

exports.update = async (req, res) => {
  //
};

exports.destroy = async (req, res) => {
  let pin = await Pin.findById(req.params.id);
  if (pin != null) {
    if (pin.owner == req.userId) {
      let deleted = await Pin.deleteOne({ _id: req.params.id });
      if (deleted) {
        //TODO: Execute socket.io
        // socket
        //   .getIO()
        //   .emit('pins', { action: 'delete', pinId: req.params.id });

        res.status(200).json({
          status: true,
          message: 'Pin deleted successfully',
        });
      } else {
        res.status(400).json({
          status: false,
          message: 'Failed to delete pin',
        });
      }
    } else {
      res.status(403).json({
        status: false,
        message: 'Delete rejected, not the owner',
      });
    }
  } else {
    res.status(404).json({
      status: false,
      message: 'Failed to find target pin',
    });
  }
};