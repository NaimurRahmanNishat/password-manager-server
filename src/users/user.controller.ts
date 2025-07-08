import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/ResponseHandler";
import User, { IUser } from "./user.model";
import generateToken from "../middleware/generateToken";
import { Types } from "mongoose";

// ✅ user registration controller
const userRegistration = async (req: Request, res: Response) => {
  try {
    const { username, email, password, birthdate } = req.body as {
      username: string;
      email: string;
      password: string;
      birthdate: Date;
    };
    if (!username || !email || !password || !birthdate) {
      return errorResponse(res, 400, "All fields are required");
    }
    const user: IUser = new User({ username, email, password, birthdate });
    await user.save();
    return successResponse(res, 200, "User registered successfully", user);
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong");
  }
};

// ✅ user login controller
const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return errorResponse(res, 400, "All fields are required");
    }

    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, "User not found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, "Incorrect password");
    }

    const token = await generateToken(user._id as Types.ObjectId);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(res, 200, "Logged in successfully", {
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        birthdate: user.birthdate,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong");
  }
};

// ✅ user logout controller
const userLogout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear the cookie named "token"
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return successResponse(res, 200, "User logged out successfully");
  } catch (error) {
    return errorResponse(res, 500, "Something went wrong during logout");
  }
};

// ✅ user delete controller
const userdelete = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return errorResponse(res, 404, "User not found!");
    }
    return successResponse(res, 200, "Successfully deleted user!", deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    errorResponse(res, 500, "Failed to delete user!");
  }
};

export { userRegistration, userLogin, userLogout, userdelete };
