import React, { useEffect, useState } from 'react';

const HealthCheck: React.FC = () => {
    const [status, setStatus] = useState<string>('Checking...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const API_BASE_URL = import.meta.env.PROD 
                    ? 'https://todo-backend-1xzvyrxrt-allan-aboks-projects.vercel.app'
                    : '';
                
                console.log('Checking health at:', `${API_BASE_URL}/api/health`);
                
                const response = await fetch(`${API_BASE_URL}/api/health`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setStatus(`✅ ${data.message}`);
                setError(null);
            } catch (err) {
                console.error('Health check failed:', err);
                setStatus('❌ Backend not reachable');
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        checkHealth();
    }, []);

    return (
        <div className="p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Backend Status:</h3>
            <p className="text-sm">{status}</p>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default HealthCheck;
