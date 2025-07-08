import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import User, { IUser } from "../users/user.model";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
}

const generateToken = async (userId: Types.ObjectId | string): Promise<string> => {
  try {
    const user = await User.findById(userId) as IUser | null;
    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.error("Error generating token", error);
    throw error;
  }
};

export default generateToken;
