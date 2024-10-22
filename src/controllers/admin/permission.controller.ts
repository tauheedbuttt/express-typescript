import { aggregate, mongoID } from "../../helpers/filter.helper";
import Action from "../../models/Action";
import Permission from "../../models/Permission";
import { Request, Response } from "../../../@types/requests";

export default {
  getPermission: async (req: Request, res: Response) => {
    const { id, text, deleted } = req.query;

    const permission = await aggregate(Permission, {
      pagination: req.query,
      filter: {
        _id: mongoID(id),
        deleted,
        search: {
          value: text,
          fields: ["name"],
        },
      },
      pipeline: [
        {
          $lookup: {
            from: "actions",
            localField: "_id",
            foreignField: "permission",
            as: "actions",
            pipeline: [{ $project: { name: 1 } }],
          },
        },
      ],
    });

    return res.success("Permission fetched successfully", permission);
  },

  addPermission: async (req: Request, res: Response) => {
    const { name, actions, url } = req.body;

    const exists = await Permission.findOne({ name });
    if (exists) return res.forbidden("Permission already exists.");

    // check if duplicate array of strings in actions
    const duplicate = new Set(
      actions.map((action: any) => action.name?.toLowerCase())
    );
    if (duplicate.size != actions.length)
      return res.forbidden("Duplicate actions not allowed.");

    const permission = await Permission.create({
      name,
      url,
    });

    await Action.bulkSave(
      actions.map((action: any) => new Action({ ...action, permission }))
    );

    return res.success("Permission added successfully");
  },

  updatePermission: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, actions, url } = req.body;

    const exists = await Permission.findOne({ _id: { $ne: id }, name });
    if (exists) return res.forbidden("Permission already exists.");

    if (actions?.length > 0) {
      // check if duplicate array of strings in actions
      const duplicate = new Set(
        actions.map((action: any) => action.name?.toLowerCase())
      );
      if (duplicate.size != actions.length)
        return res.forbidden("Duplicate actions not allowed.");

      // replace actions of this permission with passed actions, dont delete the original
      await Action.deleteMany({ permission: id });
      await Action.bulkSave(
        actions.map((action: any) => new Action({ ...action, permission: id }))
      );
    }

    const permission = await Permission.findByIdAndUpdate(
      id,
      { name, url },
      { new: true }
    );
    if (!permission) return res.notFound("Permission not found.");

    return res.success("Permission Updated Successfully");
  },

  deletePermission: async (req: Request, res: Response) => {
    const { id, deleted } = req.params;

    const permission = await Permission.findByIdAndUpdate(
      id,
      { deleted },
      { new: true }
    );
    if (!permission) return res.notFound("Permission not found.");

    return res.success(
      deleted
        ? "Permission deleted successfully"
        : "Permission recovered successfully"
    );
  },
};
