import { v2 } from "cloudinary";
import dotenv from "dotenv";
import { Request } from "express";
import multer from "multer";

export type cloudinaryReturnType = {
  public_id: string;
  format?: string;
  resource_type: string;
  created_at: string;
  url: string;
  bytes: number;
};

dotenv.config();
const { uploader, config } = v2;

config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export interface file extends Express.Multer.File {}

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed extensions
  const allowedTypes = /jpeg|jpg|png/;

  // Check mime type
  const mime = allowedTypes.test(file.mimetype);

  // Check extension (optional but safer)
  const ext = allowedTypes.test(file.originalname.toLowerCase());

  if (mime && ext) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only jpg, jpeg and png images are allowed!"));
  }
};

export const parser = multer({ storage: multer.memoryStorage(), fileFilter });

export class FileService {
  static async uploadFile(file: Buffer, folder?: string) {
    return new Promise<cloudinaryReturnType | undefined>((resolve, reject) => {
      uploader
        .upload_stream(
          {
            folder: `eventDrop/${folder || "images"}`,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(file);
    });
  }
  static async deleteFile(public_id: string) {
    await uploader.destroy(public_id, {
      resource_type: "image",
    });
  }
}
