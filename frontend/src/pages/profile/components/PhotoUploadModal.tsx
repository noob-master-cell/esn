import React from "react";
import { Button } from "../../../components/ui/Button";
import { ImageUpload } from "../../../components/ui/ImageUpload";
import { useAuth } from "../../../hooks/useAuth";

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
    const { getToken } = useAuth();
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
                        const token = await getToken();
                        const formData = new FormData();
                        formData.append('file', file);

                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';
                        // Convert graphql endpoint to upload endpoint (remove /graphql, add /upload)
                        const uploadUrl = apiUrl.replace('/graphql', '/upload');

                        const response = await fetch(uploadUrl, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
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
