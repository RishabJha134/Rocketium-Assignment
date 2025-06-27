import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Canvas API endpoints
export const canvasAPI = {
    // Initialize canvas with dimensions
    initializeCanvas: async (width, height) => {
        const response = await api.post('/canvas/initialize', { width, height });
        return response.data;
    },

    // Add rectangle to canvas
    addRectangle: async (x, y, width, height, color, filled = true) => {
        const response = await api.post('/canvas/add-rectangle', {
            x, y, width, height, color, filled
        });
        return response.data;
    },

    // Add circle to canvas
    addCircle: async (x, y, radius, color, filled = true) => {
        const response = await api.post('/canvas/add-circle', {
            x, y, radius, color, filled
        });
        return response.data;
    },

    // Add text to canvas
    addText: async (x, y, text, fontSize = 20, color = '#000000', fontFamily = 'Arial') => {
        const response = await api.post('/canvas/add-text', {
            x, y, text, fontSize, color, fontFamily
        });
        return response.data;
    },

    // Add image to canvas
    addImage: async (x, y, imageFile, width = null, height = null) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('x', x);
        formData.append('y', y);
        if (width) formData.append('width', width);
        if (height) formData.append('height', height);

        const response = await api.post('/canvas/add-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get current canvas state
    getCanvasState: async () => {
        const response = await api.get('/canvas/state');
        return response.data;
    },

    // Clear canvas
    clearCanvas: async () => {
        const response = await api.post('/canvas/clear');
        return response.data;
    },

    // Export canvas to PDF
    exportToPDF: async () => {
        const response = await api.post('/canvas/export-pdf');
        return response.data;
    },

    // Download PDF
    downloadPDF: async (filename) => {
        const response = await api.get(`/canvas/download/${filename}`, {
            responseType: 'blob',
        });
        return response.data;
    },

    // Health check
    healthCheck: async () => {
        const response = await api.get('/health');
        return response.data;
    }
};

// Utility functions
export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const handleAPIError = (error) => {
    if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Server error';
        return {
            message: errorMessage,
            status: error.response.status,
            details: error.response.data
        };
    } else if (error.request) {
        // Request was made but no response received
        return {
            message: 'Unable to connect to server. Please check if the backend is running.',
            status: 0,
            details: null
        };
    } else {
        // Something else happened
        return {
            message: error.message || 'An unexpected error occurred',
            status: 0,
            details: null
        };
    }
};

export default api;
