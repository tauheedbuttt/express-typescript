import { ICMD } from "./../../@types/index";
import { Document, model, Schema } from "mongoose";

interface ICMDDocument extends ICMD, Document {}

const CMDSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
   },
  { timestamps: true }
);

export default model<ICMDDocument>("CMD", CMDSchema);
