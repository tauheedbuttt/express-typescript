import express from "express";
import fs from "fs";
import path from "path";

const routes: any = [];
function getRoutes(directory: any, baseUrl = "") {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const folderName = path.basename(filePath);
      getRoutes(filePath, `${baseUrl}/${folderName}`);
    } else if (file.endsWith(".routes.ts")) {
      const route = `${baseUrl}/${file.replace(".routes.ts", "")}`;
      routes.push(route as any);
    }
  });
}

getRoutes(__dirname);

const router = express.Router();

routes.forEach(async (route: any) => {
  const endpoint = `/api${route}`;
  const routeModule = await import(`./${route}.routes`);
  router.use(endpoint, routeModule.default);
});

export { router };
