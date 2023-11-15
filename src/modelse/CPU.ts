import { ICPU } from "./../../@types/index";
import { Document, model, Schema } from "mongoose";

interface ICPUDocument extends ICPU, Document {}

const CPUSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
   },
  { timestamps: true }
);

export default model<ICPUDocument>("CPU", CPUSchema);
