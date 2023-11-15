import { Request, Response } from "express";
import Sale, { ISaleDocument } from "../models/Sale";

// Create a new sale
export const createSale = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale: ISaleDocument = new Sale(req.body);
    await sale.save();
    res.status(201).json({ success: true, data: sale });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all sales
export const getSales = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sales: ISaleDocument[] = await Sale.find();
    res.status(200).json({ success: true, data: sales });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a sale by ID
export const getSaleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale: ISaleDocument | null = await Sale.findById(req.params.id);
    if (!sale) {
      res.status(404).json({ success: false, message: "Sale not found" });
      return;
    }
    res.status(200).json({ success: true, data: sale });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a sale by ID
export const updateSaleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale: ISaleDocument | null = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!sale) {
      res.status(404).json({ success: false, message: "Sale not found" });
      return;
    }
    res.status(200).json({ success: true, data: sale });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a sale by ID
export const deleteSaleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sale: ISaleDocument | null = await Sale.findByIdAndDelete(
      req.params.id
    );
    if (!sale) {
      res.status(404).json({ success: false, message: "Sale not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Sale deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
