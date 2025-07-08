import mongoose, { Schema, Document } from "mongoose";
// import bcrypt from "bcrypt";

export interface IDocument extends Document {
  email: string;
  password: string;
  account: string;
  other: string;
  user: mongoose.Types.ObjectId;
}

const SheetSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    account: { type: String, required: true },
    other: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// // 🔐 Password hash before saving
// SheetSchema.pre<IDocument>("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

const Sheet = mongoose.model<IDocument>("Sheet", SheetSchema);

export default Sheet;
