const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { User } = require('../models');
const util = require('util');

// const uploadPromise = util.promisify(cloudinary.uploader.upload);
// uploadPromise(req.file.path)
//   .then(result => {})
//   .catch(err => {});

exports.updateProfileImg = (req, res, next) => {
  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err) return next(err);

    await User.update(
      { profileImg: result.secure_url },
      { where: { id: req.user.id } }
    );

    if (req.user.profileImg) {
      const splited = req.user.profileImg.split('/');
      cloudinary.uploader.destroy(splited[splited.length - 1].split('.')[0]);
    }

    fs.unlinkSync(req.file.path);
    res.json({
      message: 'upload profile image completed',
      profileImg: result.secure_url
    });
  });
};

exports.getMe = (req, res, next) => {
  const { id, firstName, lastName, profileImg, email, phoneNumber } = req.user;
  res
    .status(200)
    .json({
      user: { id, firstName, lastName, profileImg, email, phoneNumber }
    });
};
