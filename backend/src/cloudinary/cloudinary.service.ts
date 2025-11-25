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
                    quality: 'auto', // Smart quality compression
                    fetch_format: 'auto', // Auto-format (WebP, AVIF)
                    // Size limits for image uploads
                    transformation: [
                        {
                            width: 1200, // Reduced from 2000 for better optimization
                            height: 1200,
                            crop: 'limit', // Don't upscale
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
    async deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }

    extractPublicIdFromUrl(url: string): string | null {
        try {
            // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/esn-uploads/filename.jpg
            const splitUrl = url.split('/');
            const filenameWithExtension = splitUrl[splitUrl.length - 1];
            const filename = filenameWithExtension.split('.')[0];

            // If it's in a folder (which we use: 'esn-uploads'), we need to include it
            // We look for the folder name in the URL segments
            const folderIndex = splitUrl.indexOf('esn-uploads');
            if (folderIndex !== -1) {
                return `esn-uploads/${filename}`;
            }

            return filename;
        } catch (error) {
            console.error('Error extracting public ID:', error);
            return null;
        }
    }
}
