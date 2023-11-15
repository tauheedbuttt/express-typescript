import { IFinance } from "./../../@types/index";
import { Document, model, Schema } from "mongoose";

interface IFinanceDocument extends IFinance, Document {}

const FinanceSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
   },
  { timestamps: true }
);

export default model<IFinanceDocument>("Finance", FinanceSchema);
