import jwt from "jsonwebtoken";

export const handleDecodeErrors = ({ err, res, next }: any) => {
  if (err.name == "TokenExpiredError")
    return next
      ? next(
          new Error("Your request is not authorized as your token is expired.")
        )
      : res.forbidden(
          "Your request is not authorized as your token is expired."
        );
  else if (err.name == "JsonWebTokenError")
    return next
      ? next(new Error("Your request is not authorized as token is invalid."))
      : res.forbidden("Your request is not authorized as token is invalid.");
  else return next ? next(new Error(err)) : res.forbidden(err);
};

export const createToken = (data: any) => {
  const token = jwt.sign(data, process.env.JWT_SECRET_KEY as any, {
    expiresIn: "30d",
  });
  return token;
};
