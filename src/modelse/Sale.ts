import { Schema, model, Document } from "mongoose";
import { ISale } from "../../@types";

export interface ISaleDocument extends ISale, Document {}

const SaleSchema = new Schema(
  {
    salePersonId: {
      type: Schema.Types.ObjectId,
      ref: "SalePerson",
      required: true,
    },
    investerName: { type: String, required: true },
    investerCNIC: { type: String, required: true },
    investerDistrict: { type: String, required: true },
    investorPhone: { type: String, required: true },
    investerFatherName: { type: String, required: true },
    investorBankName: { type: String, required: true },
    investorAccountTitile: { type: String, required: true },
    investorAccountNumber: { type: String, required: true },
    NextOfKin: { type: String, required: true },
    NextOfKinPhone: { type: String, required: true },
    NextOfKinCnic: { type: String, required: true },
    currency: { type: String, required: true },
    totalAmount: { type: String, required: true },
    continuity: { type: Boolean },
    amountRecieved: { type: String, required: true },
    tenure: { type: String, required: true },
    natureofAgrement: { type: String, required: true },
    bonusAdjusted: { type: Boolean },
    bonusPhoneNo: { type: String, required: true },
    bonusAccountBankName: { type: String, required: true },
    bonusAccountNumber: { type: String, required: true },
    bonusAccountTitle: { type: String, required: true },
    returnDay: { type: String, required: true },
    status: {
      finance: { type: Boolean, default: false },
      cpu: { type: Boolean, default: false },
      cmd: { type: Boolean, default: false },
    },
  },
  { timestamps: true } 
);

export default model<ISaleDocument>("Sale", SaleSchema);
