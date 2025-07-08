import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/ResponseHandler";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return errorResponse(res, 401, "Unauthenticated access!");
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY) as {
      userId: string;
    };

    if (!decoded?.userId) {
      return errorResponse(res, 403, "Access denied!");
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return errorResponse(res, 500, "Invalid token!");
  }
};


