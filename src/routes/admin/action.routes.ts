// Controllers
import ActionController from "../../controllers/admin/action.controller";
import { jwtVerify } from "../../middlewares/authentication/jwt.middleware";
import { validate } from "../../validations/validator";
import check from "../../validations//admin/action.validation";

import express from "express";
const router = express.Router();

router.get(
  "/",
  jwtVerify("Super Admin") as any,
  ActionController.getAction as any
);

router.post(
  "/add",
  jwtVerify("Super Admin") as any,
  validate(check("add")) as any,
  ActionController.addAction as any
);

router.put(
  "/update/:id",
  jwtVerify("Super Admin") as any,
  validate(check("update")) as any,
  ActionController.updateAction as any
);

router.delete(
  "/delete/:id",
  jwtVerify("Super Admin") as any,
  (req: any, res: any, next: any) => {
    req.params.deleted = true;
    next();
  },
  ActionController.deleteAction as any
);

router.put(
  "/recover/:id",
  jwtVerify("Super Admin") as any,
  (req: any, res: any, next: any) => {
    req.params.deleted = false;
    next();
  },
  ActionController.deleteAction as any
);

module.exports = router;
