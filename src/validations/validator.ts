import { NextFunction, Request, Response } from "../../@types/requests";

const { validationResult } = require("express-validator");

export const validate = (validations: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(
      validations.map((validation: any) => validation.run(req))
    );

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    var errorArray = new Array();
    errors.array().forEach((element: any) => {
      errorArray.unshift(element.msg);
    });

    return res
      .status(422)
      .json({ success: false, message: errorArray, data: [] });
  };
};
