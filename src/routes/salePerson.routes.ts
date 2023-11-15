import express, { Router } from "express";
import {
  createSalePerson,
  deleteSalePerson,
  getAllSalePersons,
  getSalePersonById,
  updateSalePerson,
} from "../controllers/salePerson.controller";

const SalePersonRouter: Router = express.Router();

// Create a new sale person
SalePersonRouter.post("/createSalePerson", createSalePerson);

// Get all sale persons
SalePersonRouter.get("/", getAllSalePersons);

// Get a specific sale person
SalePersonRouter.get("/:id", getSalePersonById);

// Update a sale person
SalePersonRouter.put("/:id", updateSalePerson);

// Delete a sale person
SalePersonRouter.delete("/:id", deleteSalePerson);

export default SalePersonRouter;
