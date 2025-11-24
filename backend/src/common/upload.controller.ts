import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Get,
    Param,
    Res,
    UseGuards,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import { Response } from 'express';
import { join } from 'path';
import { Auth0Guard } from '../auth/guards/auth0.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import * as crypto from 'crypto';
import { existsSync } from 'fs';

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
    @Post()
    @UseGuards(Auth0Guard) // Require authentication
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    // Generate secure random filename
                    const randomName = crypto.randomBytes(16).toString('hex');
                    const extension = extname(file.originalname).toLowerCase();
                    const filename = `${randomName}${extension}`;


                    return cb(null, filename);
                },
            }),
            fileFilter: fileFilter,
            limits: {
                fileSize: MAX_FILE_SIZE,
                files: 1, // Only one file at a time
            },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }



        // Return relative URL (not hardcoded localhost)
        return {
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            size: file.size,
            mimeType: file.mimetype,
        };
    }

    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        // Prevent path traversal attacks
        const safeFilename = basename(filename);

        // Additional validation: only allow alphanumeric, hyphens, underscores, and dots
        if (!/^[a-zA-Z0-9._-]+$/.test(safeFilename)) {
            throw new BadRequestException('Invalid filename');
        }

        const filePath = join(process.cwd(), 'uploads', safeFilename);

        // Check if file exists
        if (!existsSync(filePath)) {
            throw new NotFoundException('File not found');
        }

        // Set appropriate cache headers
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year

        return res.sendFile(filePath);
    }
}
