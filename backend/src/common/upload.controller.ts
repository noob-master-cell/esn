import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { Auth0Guard } from '../auth/guards/auth0.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

// Allowed MIME types for uploads
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// File type validator
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(
            new BadRequestException(
                `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
            ),
            false
        );
    }

    // Additional extension check
    const ext = extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];

    if (!allowedExtensions.includes(ext)) {
        return cb(
            new BadRequestException(
                `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
            ),
            false
        );
    }

    cb(null, true);
};

@Controller('upload')
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 uploads per minute
export class UploadController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post()
    @UseGuards(Auth0Guard) // Require authentication
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            fileFilter: fileFilter,
            limits: {
                fileSize: MAX_FILE_SIZE,
                files: 1, // Only one file at a time
            },
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const result = await this.cloudinaryService.uploadImage(file);
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw new BadRequestException(`Image upload failed: ${error.message || 'Unknown error'}`);
        }
    }
}
