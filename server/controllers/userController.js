import User from "../models/User.js";

// GET CURRENT USER
export const getMe = async (req, res) => {
  res.json(req.user);
};

// UPDATE USER (name, phone etc.)
export const updateMe = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  const updated = await user.save();

  res.json(updated);
};

// UPLOAD PROFILE IMAGE
export const uploadProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // assuming multer adds file path
  user.profileImage = req.file.path;

  const updated = await user.save();

  res.json({
    user: updated,
  });
};