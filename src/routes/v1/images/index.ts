import { Router, Request, Response, NextFunction } from "express";

import { ImagesController } from "../../../controllers";


const router = Router();
const imagesController = new ImagesController();

router.post('/upload-url', (req: Request, res: Response, next: NextFunction) => {
  imagesController.getUploadUrl(req, res, next);
});

export default router;
