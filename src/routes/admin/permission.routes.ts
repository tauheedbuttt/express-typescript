// Controllers
import PermissionController from "../../controllers/admin/permission.controller";
import { jwtVerify } from "../../middlewares/authentication/jwt.middleware";
import { validate } from "../../validations/validator";
import check from "../../validations//admin/permission.validation";

import express from "express";
const router = express.Router();

router.get(
  "/",
  jwtVerify("Super Admin") as any,
  PermissionController.getPermission as any
);

router.post(
  "/add",
  jwtVerify("Super Admin") as any,
  validate(check("add")) as any,
  PermissionController.addPermission as any
);

router.put(
  "/update/:id",
  jwtVerify("Super Admin") as any,
  validate(check("update")) as any,
  PermissionController.updatePermission as any
);

router.delete(
  "/delete/:id",
  jwtVerify("Super Admin") as any,
  (req: any, res: any, next: any) => {
    req.params.deleted = true;
    next();
  },
  PermissionController.deletePermission as any
);

router.put(
  "/recover/:id",
  jwtVerify("Super Admin") as any,
  (req: any, res: any, next: any) => {
    req.params.deleted = false;
    next();
  },
  PermissionController.deletePermission as any
);

module.exports = router;
