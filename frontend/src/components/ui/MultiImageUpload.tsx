import React, { useState, useRef } from "react";


interface MultiImageUploadProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    onUpload: (file: File) => Promise<string>;
    label?: string;
    maxImages?: number;
    className?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    value = [],
    onChange,
    onUpload,
    label = "Event Images",
    maxImages = 5,
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

        const files = Array.from(e.dataTransfer.files);
        await handleFiles(files);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            await handleFiles(files);
        }
    };

    const handleFiles = async (files: File[]) => {
        // Check if we would exceed the limit
        if (value.length + files.length > maxImages) {
            setError(`You can only upload up to ${maxImages} images`);
            return;
        }

        // Validate file types
        const invalidFiles = files.filter((file) => !file.type.startsWith("image/"));
        if (invalidFiles.length > 0) {
            setError("Please upload only image files");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const uploadPromises = files.map((file) => onUpload(file));
            const urls = await Promise.all(uploadPromises);
            onChange([...value, ...urls]);
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload some images");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    const canUploadMore = value.length < maxImages;

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                <span className="text-gray-500 text-xs ml-2">
                    ({value.length}/{maxImages})
                </span>
            </label>

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {value.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all transform hover:scale-110"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    Cover
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {canUploadMore && (
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
                        multiple
                        onChange={handleFileSelect}
                    />

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
                                Upload files
                            </button>{" "}
                            or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF, WebP up to 5MB each
                        </p>
                    </div>

                    {isUploading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {value.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                    The first image will be used as the cover image.
                </p>
            )}
        </div>
    );
};
