import { check } from "express-validator";

export default (method: any) => {
  switch (method) {
    case "add": {
      return [
        check("name").notEmpty().withMessage("Name cannot be empty"),
        check("permissions")
          .notEmpty()
          .withMessage("Permissions cannot be empty"),
      ];
    }
    case "update": {
      return [];
    }
  }
};
