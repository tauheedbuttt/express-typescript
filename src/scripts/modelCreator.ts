import fs from "fs";
import path from "path";

export default (routeParts: any, routeFileName: any, routeName: any) => {
  // Define the base folder for controllers (outside the "scripts" folder)
  const modelBaseFolder = path.join(__dirname, "..", "models");

  // Build the full path to the new route file
  const modelFolderPath = path.join(modelBaseFolder);

  // Create the necessary directories recursively for both routes and controllers
  const createDirectories = (folderPath: any) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  };

  createDirectories(modelFolderPath);

  // Create the new model file with dynamic content
  const modelsContent = `
import mongoose from "mongoose";
    
const ${routeName} = new mongoose.Schema({
    name: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export default mongoose.model('${routeName}', ${routeName});
    `;

  const modelsFilePath = path.join(modelFolderPath, `${routeName}.ts`);
  fs.writeFileSync(modelsFilePath, modelsContent);

  console.log(`Model created: ${modelsFilePath}`);
};
