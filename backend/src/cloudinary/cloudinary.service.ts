import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'esn-uploads',
                    // Automatic optimizations
                    quality: 'auto:good', // Automatic quality optimization
                    fetch_format: 'auto', // Auto-format (WebP, AVIF for supported browsers)
                    // Size limits for image uploads
                    transformation: [
                        {
                            width: 2000,
                            height: 2000,
                            crop: 'limit', // Don't upscale, only downscale if larger
                        },
                    ],
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}
