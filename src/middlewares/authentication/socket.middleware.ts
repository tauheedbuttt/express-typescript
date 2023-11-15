import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { Socket } from "socket.io";

import { handleDecodeErrors } from "../../helpers/jwt.helper";
import User from "../../models/User";

export const jwtVerify = (socket: Socket, next: NextFunction) => {
  const token = socket.handshake?.query?.token as any;
  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as any,
    async function (err: any, decoded: any) {
      if (err) return handleDecodeErrors({ err, next });
      const { sub } = decoded;

      const user = await User.findOne({
        _id: sub,
        status: "Approved",
      }).select("-password");

      if (!user) return next(new Error("Unauthorized"));

      next();
    }
  );
};

export default { jwtVerify };
