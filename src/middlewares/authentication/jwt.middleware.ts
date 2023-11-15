import jwt from "jsonwebtoken";
import { handleDecodeErrors } from "../../helpers/jwt.helper";
import User from "../../models/User";
import Role from "../../models/Role";
import { NextFunction, Response, Request } from "../../../@types/requests";

export const jwtVerify =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token: any = req.headers["authorization"]?.replace("Bearer ", "");
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as any,
      async function (err: any, decoded: any) {
        if (err) return handleDecodeErrors({ err, res });

        const { sub, name } = decoded;

        // Check if User Exists
        const user = await User.findOne({
          _id: sub,
          status: "Approved",
        })
          .populate({
            path: "role",
            select: "name permissions",
            populate: {
              path: "permissions",
              select: "name actions",
              populate: [
                {
                  path: "permission",
                  select: "name url",
                },
                {
                  path: "actions",
                  select: "name ",
                },
              ],
            },
          })
          .select("-password");

        if (!user) return res.auth("Unauthorized");

        // Check if Role Exists

        if (roles.length > 0) {
          const existing = await Role.find({ name: { $in: roles } });
          const includes = existing?.find((role) =>
            role._id.equals((user.role as any)?._id)
          );
          if (!includes) return res.auth("Unauthorized");
        }

        req.user = user;
        req.sub = sub;
        req.name = name;

        next();
      }
    );
  };
