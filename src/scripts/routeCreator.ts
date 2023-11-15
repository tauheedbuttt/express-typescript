import fs from "fs";
import path from "path";

export default (routeParts: any, routeFileName: any, routeName: any) => {
  // Define the base folder for routes (outside the "scripts" folder)
  const routesBaseFolder = path.join(__dirname, "..", "routes");

  // Calculate the relative path to controllers, middlewares, and constants based on the depth of the route
  const relativePath = Array(routeParts.length + 1)
    .fill("..")
    .join("/");

  // Build the full path to the new route file
  const routeFolderPath = path.join(routesBaseFolder, ...routeParts);

  // Create the necessary directories recursively for both routes and controllers
  const createDirectories = (folderPath: any) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  };

  createDirectories(routeFolderPath);

  // Create the new route file with dynamic content
  const routeContent = `// Controllers
import express from 'express';
const router = express.Router();

import ${routeName}Controller from "${relativePath}/controllers/${routeParts.join(
    "/"
  )}/${routeName.toLowerCase()}.controller";
import { jwtVerify } from "${relativePath}/middlewares/authentication/jwt.middleware";
import { validate } from "${relativePath}/validations/validator";
import check from "${relativePath}/validations//${routeParts.join(
    "/"
  )}/${routeName.toLowerCase()}.validation";


router.get(
    '/', 
    jwtVerify() as any, 
    ${routeName}Controller.get${routeName} as any
)

router.post(
    '/add', 
    jwtVerify() as any, 
    validate(check('add')) as any, 
    ${routeName}Controller.add${routeName} as any
)

router.put(
    '/update/:id', 
    jwtVerify() as any, 
    validate(check('update')) as any, 
    ${routeName}Controller.update${routeName} as any
)

router.delete(
    '/delete/:id',
    jwtVerify() as any,
    (req:any, res: any, next: any) => { req.params.deleted = true; next(); }
    , ${routeName}Controller.delete${routeName} as any
)

router.put(
    '/recover/:id',
    jwtVerify() as any,
    (req:any, res: any, next: any) => { req.params.deleted = false; next(); }
    , ${routeName}Controller.delete${routeName} as any
)

export default router
`;

  const routeFilePath = path.join(routeFolderPath, routeFileName);
  fs.writeFileSync(routeFilePath, routeContent);

  console.log(`Route created: ${routeFilePath}`);
};
