import { ProcessImageHandler } from "./process-image.handler";

const processImageHandler = new ProcessImageHandler();

const processImage = async (event, context, callback) => {
  await processImageHandler.execute(event);
};

module.exports.processImage = processImage;
