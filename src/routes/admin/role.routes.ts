// Controllers
import RoleController from "../../controllers/admin/role.controller";
import { jwtVerify } from "../../middlewares/authentication/jwt.middleware";
import { validate } from "../../validations/validator";
import check from "../../validations//admin/role.validation";

import express from "express";
const router = express.Router();

router.get("/", jwtVerify("Super Admin") as any, RoleController.getRole as any);

router.post(
  "/add",
  jwtVerify("Super Admin") as any,
  validate(check("add")) as any,
  RoleController.addRole as any
);

router.put(
  "/update/:id",
  jwtVerify("Super Admin") as any,
  validate(check("update")) as any,
  RoleController.updateRole as any
);

router.delete(
  "/delete/:id",
  jwtVerify("Super Admin") as any,
  (req: any, res: any, next: any) => {
    req.params.deleted = true;
    next();
  },
  RoleController.deleteRole as any
);

router.put(
  "/recover/:id",
  jwtVerify("Super Admin") as any,
  (req: any, res: any, next: any) => {
    req.params.deleted = false;
    next();
  },
  RoleController.deleteRole as any
);

module.exports = router;
