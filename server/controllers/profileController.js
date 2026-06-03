import User from "../models/User.js";

// GET LOGGED USER
export const getMe = async (req, res) => {
  res.json(req.user);
};

// UPDATE PROFILE
export const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updated = await user.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPLOAD PROFILE IMAGE (SIMPLE VERSION)
export const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = `/uploads/${req.file.filename}`;

    const updated = await user.save();

    res.json({ user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};