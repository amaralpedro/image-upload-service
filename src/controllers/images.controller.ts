import { Request, Response, NextFunction } from "express";

import { s3Buckets } from "../lib/config";
import { S3Service } from "../services";


class ImagesController {
  private readonly imageContentTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];

  constructor(
    private readonly s3Service = new S3Service(s3Buckets.images)
  ) {}

  public getUploadUrl(req, res: Response, next: NextFunction): void {
    const { filename, contentType } = req.body;
    const { userId } = req;
    if (!this.isValidImageContentType(contentType)) {
      res.status(400).json({ message: 'Invalid image content type' });
      return;
    }
    try {
      const uploadUrl = this.s3Service.createSignedUrl(`image-${userId}-${filename}`, contentType);
      res.json({ uploadUrl });
    } catch (error) {
      console.error(`Error trying to generate an upload URL: ${error}`);
      res.status(500).json({ message: error.message });
    }
  }

  private isValidImageContentType(contentType: string): boolean {
    return this.imageContentTypes.includes(contentType?.toLowerCase());
  }
}

export default ImagesController;
