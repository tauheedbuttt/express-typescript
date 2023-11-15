import { Schema, model, Document } from "mongoose";
import { IReturns, SaleStatus } from "../../@types";

interface IReturnDocument extends IReturns, Document {}

const SaleTransactionSchema = new Schema({
  saleId: {
    type: Schema.Types.ObjectId,
    ref: "SalePerson",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: Object.values(SaleStatus),
    default: SaleStatus.PENDING,
  },
  returnAmount: { type: String, required: true },
});

// Mongoose model for SaleTransaction
const SaleTransactionModel = model<IReturnDocument>(
  "SaleTransaction",
  SaleTransactionSchema
);

export default SaleTransactionModel;
