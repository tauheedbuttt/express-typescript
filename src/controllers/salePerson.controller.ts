// controllers/salePersonController.ts
import { Request, Response } from "express";
import SalePersonModel, {
  ISalePersonDocument,
} from "../../src/modelse/SalePerson";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login sale person
export const signUp = async (req: Request, res: Response) => {
  try {
    const { salePersonEmail, password } = req.body;
    const user = await SalePersonModel.findOne({ salePersonEmail });
    if (user) {
      const matchPassword = await bcrypt.compare(password, user.password);
      const token = jwt.sign(
        { userId: user?._id, email: user?.salePersonEmail },
        "mySecretKey",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        success: true,
        token: token,
        message: "Signed in successfully",
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new sale person
export const createSalePerson = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const salePerson = new SalePersonModel({
      ...req.body,
      password: hashedPassword,
    });
    console.log(salePerson);
    const savedSalePerson = await salePerson.save();
    res.status(201).json(savedSalePerson);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sale persons
export const getAllSalePersons = async (req: Request, res: Response) => {
  try {
    const salePerson = await SalePersonModel.find();
    res.status(200).json({ success: true, salePerson });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific sale person
export const getSalePersonById = async (req: Request, res: Response) => {
  try {
    const salePerson = await SalePersonModel.findById(req.params.id);
    if (!salePerson) throw new Error("Sale person not found");
    res.status(200).json({ success: true, salePerson });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// Update a sale person
export const updateSalePerson = async (req: Request, res: Response) => {
  try {
    const { salePersonEmail } = req.body;
    if (salePersonEmail) {
      throw new Error("Updating email address is not allowed");
    }
    const { id } = req.params;
    const salePerson = await SalePersonModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!salePerson) throw new Error("Sale person not found");
    res.status(200).json({ success: true, salePerson });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// Delete a sale person
export const deleteSalePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const salePerson = await SalePersonModel.findByIdAndRemove(id);
    if (!salePerson) throw new Error("Sale person not found");
    res.status(200).json({ success: true, salePerson });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
