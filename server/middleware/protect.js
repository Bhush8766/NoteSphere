import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      req.user = user;

      next();
    } catch (err) {
      return res.status(401).json({
        message: "Token is invalid or expired",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Auth middleware error",
    });
  }
};

export default protect;