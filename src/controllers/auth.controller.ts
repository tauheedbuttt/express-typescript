import { NextFunction, Request, Response } from "../../@types/requests";

import crypto from "crypto";
import User from "../models/User";

import { createToken } from "../helpers/jwt.helper";
import { uniqueQuery } from "../helpers/filter.helper";
import { sendEmail } from "../helpers/email-service.helper";
import { jwtVerify } from "../middlewares/authentication/jwt.middleware";

export default {
  profile: async (req: Request, res: Response) => {
    return res.success("Profile fetched successuflly", req.user);
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // get user
    const user = await User.findOne({ email }).populate({
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
            select: "name",
          },
        ],
      },
    });
    if (!user) return res.forbidden("Invalid Email or Password");
    if (user.status != "Approved")
      return res.forbidden("Your account has not been approved yet");

    try {
      // compare password
      await (user as any).comparePassword(password);
    } catch (err) {
      return res.forbidden("Invalid Email or Password");
    }

    const token = createToken({
      sub: user.id,
      name: user.name,
    });

    return res.success("Login successfull", { token, role: user.role });
  },

  register: async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password != confirmPassword)
      return res.forbidden("Confirm Password is not same as Password.");

    const unique = [
      {
        field: "email",
        value: email,
      },
    ];
    const uniqueResult = uniqueQuery(unique);

    const existing = await User.findOne({
      ...uniqueResult.query,
    });
    if (existing) return res.forbidden(uniqueResult.message);

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();
    return res.success("Registration Successfull", user);
  },

  update: async (req: Request, res: Response) => {
    const { email, name } = req.body;

    const unique = [
      {
        field: "email",
        value: email,
      },
    ];

    const user = req.user;
    const uniqueResult = uniqueQuery(unique);

    const existing = await User.findOne({
      _id: { $ne: user.id },
      ...uniqueResult.query,
    });

    if (existing) return res.forbidden(uniqueResult.message);

    user.email = email ? email : user.email;
    user.name = name ? name : user.name;

    await user.save();

    return res.success("Profile updated successuflly", user);
  },

  forgot: async (req: Request, res: Response) => {
    const { email } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.forbidden("No account found against this email");

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const days = 10;
    user.resetPasswordExpire = Date.now() + days * 60 * 1000;
    const url = `${process.env.CLIENT_ORIGIN}/reset?resetPasswordToken=${user.resetPasswordToken}`;
    await user.save({ validateBeforeSave: false });

    await sendEmail("Reset Password", {
      email,
      url,
    });

    res.success("Password reset link sent to email.");
  },

  reset: async (req: Request, res: Response, next: NextFunction) => {
    const { old_password, new_password, confirm_password, resetPasswordToken } =
      req.body;

    // validate inputs

    if (resetPasswordToken && old_password)
      return res.forbidden(
        "resetPasswordToken and old_password can not come at the same time"
      );
    if (!new_password) return res.forbidden("new_password is missing");
    if (!confirm_password) return res.forbidden("confirm_password is missing");
    if (confirm_password != new_password)
      return res.forbidden("confirm_password not same as new_password");

    // Normal Password Reset
    if (!resetPasswordToken) {
      if (!old_password) res.notFound("old_password is missing");
      const middleware = jwtVerify();
      return middleware(req, res, async () => {
        try {
          const user = await User.findById(req.user.id);
          await (user as any).comparePassword(old_password);
          (user as any).password = new_password;
          await user?.save({ validateBeforeSave: false });
          res.success("Password changed successfully.", { changed: true });
        } catch (err) {
          res.forbidden("old_password is not same as current password");
        }
      });
    }

    // Forgot Password Reset
    if (!old_password) {
      if (!resetPasswordToken)
        return res.forbidden("resetPasswordToken is missing");
    }

    // check the resetPasswordToken
    const user = await User.findOne({ resetPasswordToken });
    if (!user) return res.notFound("Invalid reset token");

    // if the token is expired
    if (Date.now() > (user as any).resetPasswordExpire)
      return res.forbidden("The token is expired");

    // update password and remove token
    user.password = new_password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.success("Password changed successfully.", { changed: true });
  },
};
