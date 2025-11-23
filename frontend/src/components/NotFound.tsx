// src/components/NotFound.tsx
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};
export default NotFound;
