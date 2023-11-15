import fs from "fs";
import path from "path";

export default (routeParts: any, routeFileName: any, routeName: any) => {
  // Define the base folder for controllers (outside the "scripts" folder)
  const controllersBaseFolder = path.join(__dirname, "..", "controllers");

  // Calculate the relative path to controllers, middlewares, and constants based on the depth of the route
  const relativePath = Array(routeParts.length + 1)
    .fill("..")
    .join("/");

  const controllerFolderPath = path.join(controllersBaseFolder, ...routeParts);

  // Create the necessary directories recursively for both routes and controllers
  const createDirectories = (folderPath: any) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  };

  createDirectories(controllerFolderPath);

  // Create the new controller file with dynamic content
  const controllerContent = `
import { aggregate, mongoID } from "${relativePath}/helpers/filter.helper";
import ${routeName} from "${relativePath}/models/${routeName}";
import { NextFunction, Request, Response } from "${relativePath}/../@types/requests";

export default {
    get${routeName}: async (req: Request, res: Response) => {
        const { id, text, deleted } = req.query;

        const ${routeName.toLowerCase()} = await aggregate(${routeName}, {
            pagination: req.query,
            filter: {
                _id: mongoID(id),
                deleted,
                search: {
                    value: text,
                    fields: ['name']
                }
            },
            pipeline: []
        });

        return res.success("${routeName} fetched successfully", ${routeName.toLowerCase()})
    },

    add${routeName}: async (req: Request, res: Response) => {
        const { name } = req.body;

        const exists = await ${routeName}.findOne({ name });
        if (exists) return res.forbidden("${routeName} already exists.");

        const ${routeName.toLowerCase()} = await ${routeName}.create({
            name
        });

        return res.success("${routeName} added successfully")
    },

    update${routeName}: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.body;

        const exists = await ${routeName}.findOne({ _id: { $ne: id }, name });
        if (exists) return res.forbidden("${routeName} already exists.");

        const ${routeName.toLowerCase()} = await ${routeName}.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        if (!${routeName.toLowerCase()}) return res.notFound("${routeName} not found.");

        return res.success("${routeName} Updated Successfully")
    },

    delete${routeName}: async (req: Request, res: Response) => {
        const { id, deleted } = req.params;

        const ${routeName.toLowerCase()} = await ${routeName}.findByIdAndUpdate(
            id,
            { deleted },
            { new: true }
        );
        if (!${routeName.toLowerCase()}) return res.notFound("${routeName} not found.");
        
        return res.success(deleted ? "${routeName} deleted successfully": "${routeName} recovered successfully" )
    }
};
`;

  const controllerFilePath = path.join(
    controllerFolderPath,
    `${routeName.toLowerCase()}.controller.ts`
  );
  fs.writeFileSync(controllerFilePath, controllerContent);

  console.log(`Controller created: ${controllerFilePath}`);
};
