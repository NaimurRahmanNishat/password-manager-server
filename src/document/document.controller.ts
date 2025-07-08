import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/ResponseHandler";
import Sheet from "./document.model";

// ✅ Create Sheet for Logged-in User
const createSheet = async (req: Request, res: Response) => {
  try {
    const { email, password, account, other } = req.body;
    const userId = req.userId as string; // ✅ Correct usage

    if (!userId) {
      return errorResponse(res, 401, "Unauthorized: No user info");
    }
    
    const result = await Sheet.create({ email, password, account, other, user: userId });
    await result.save();
    return successResponse(res, 201, "Sheet created successfully", result);
  } catch (error) {
    return errorResponse(res, 500, "Failed to create sheet");
  }
};


// ✅ Get Sheets for Logged-in User
const getSheet = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    if (!userId) {
      return errorResponse(res, 401, "Unauthorized: No user info");
    }
    const sheets = await Sheet.find({ user: userId }).sort({ createdAt: -1 });
    return successResponse(res, 200, "Sheet retrieved successfully", sheets);
  } catch (error) {
    console.error("Error in getSheet:", error);
    return errorResponse(res, 500, "Failed to retrieve sheet");
  }
};


// ✅ Update Sheet for Logged-in User
const updateSheet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { email, password, account, other } = req.body as {
      email?: string;
      password?: string;
      account?: string;
      other?: string;
    };

    const userId = req.userId as string; // ✅ Correct usage

    if (!userId) {
      return errorResponse(res, 401, "Unauthorized: No user info");
    }

    const sheet = await Sheet.findOne({ _id: id, user: userId });

    if (!sheet) {
      return errorResponse(res, 404, "Sheet not found or you do not have permission to update it.");
    }

    // Update fields if they are provided in the request body
    if (email !== undefined) sheet.email = email;
    if (account !== undefined) sheet.account = account;
    if (other !== undefined) sheet.other = other;

    // Handle password update: the pre-save hook will hash it
    if (password !== undefined) {
      sheet.password = password;
    }

    // Save the updated sheet, triggering the pre-save hook for password hashing
    const result = await sheet.save();

    // Correctly use successResponse to send the response
    return successResponse(res, 200, "Sheet updated successfully", result);

  } catch (error) {
    console.error("Error in updateSheet:", error);
    // Provide more specific error messages if possible
    if (error instanceof Error) {
      return errorResponse(res, 500, `Failed to update sheet: ${error.message}`);
    }
    return errorResponse(res, 500, "Failed to update sheet due to an unexpected error.");
  }
};


// ✅ Delete Sheet for Logged-in User
const deleteSheet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.userId as string; // ✅ Correct usage

    if (!userId) {
      return errorResponse(res, 401, "Unauthorized: No user info");
    }

    const result = await Sheet.findOneAndDelete({ _id: id, user: userId });
    if (!result) {
      return errorResponse(res, 404, "Sheet not found or you do not have permission to delete it.");
    }
    return successResponse(res, 200, "Sheet deleted successfully", result);
  } catch (error) {
    console.error("Error in deleteSheet:", error);
    if (error instanceof Error) {
      return errorResponse(res, 500, `Failed to delete sheet: ${error.message}`);
    } else {
      return errorResponse(res, 500, "Failed to delete sheet due to an unexpected error.");
    }
  }
};


export { createSheet, getSheet, updateSheet, deleteSheet };