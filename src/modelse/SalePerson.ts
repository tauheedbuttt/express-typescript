import { Schema, model, Document } from "mongoose";
import { ISalePerson } from "../../@types";

export interface ISalePersonDocument extends ISalePerson, Document {}

// Mongoose schema for SalePerson
const SalePersonSchema = new Schema({
  salePersonName: { type: String, required: true },
  salePersonEmail: { type: String, required: true },
  salePersonPhone: { type: String, required: true },
  salePersonCnic: { type: String, required: true },
  password: { type: String, required: true },
});

SalePersonSchema.path("salePersonEmail").validate(async (email: string) => {
  // @ts-ignore
  const count = await SalePersonModel.countDocuments({
    salePersonEmail: email,
  });
  return !count;
}, "Email already exists");

// Mongoose model for SalePerson
const SalePersonModel = model<ISalePersonDocument>(
  "SalePerson",
  SalePersonSchema
);

export default SalePersonModel;
