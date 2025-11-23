import React from "react";
import { Button } from "../../../components/ui/Button";
import { ImageUpload } from "../../../components/ui/ImageUpload";

interface PhotoUploadModalProps {
    dbUser: any;
    onClose: () => void;
    onUploadComplete: (url: string) => Promise<void>;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
    dbUser,
    onClose,
    onUploadComplete,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-xl font-bold mb-4">Update Profile Photo</h3>
                <ImageUpload
                    value={dbUser?.avatar}
                    onChange={async (url) => {
                        await onUploadComplete(url);
                        onClose();
                    }}
                    onUpload={async (file) => {
                        const formData = new FormData();
                        formData.append('file', file);
                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                        });
                        if (!response.ok) throw new Error('Upload failed');
                        const data = await response.json();
                        return data.url;
                    }}
                />
                <div className="mt-4 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};
