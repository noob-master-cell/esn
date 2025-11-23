import React, { useState, useRef } from "react";
import { Button } from "./Button";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onUpload: (file: File) => Promise<string>;
    label?: string;
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    onUpload,
    label = "Image",
    className = "",
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            await handleFile(file);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleFile(file);
        }
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const url = await onUpload(file);
            onChange(url);
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                {value ? (
                    <div className="relative group">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change Image
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg
                                className="w-full h-full"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            <button
                                type="button"
                                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload a file
                            </button>{" "}
                            or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};
